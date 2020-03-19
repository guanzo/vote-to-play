const axios = require('axios')
const createDebug = require('debug')

const voteModel = require('../models/vote-model')
const gameModel = require('../models/game-model')
const jwt = require('jsonwebtoken')
const e = require('../../../shared/pubsub-events')

const { TWITCH_EXTENSION_SECRET, TWITCH_CLIENT_ID, NODE_ENV } = process.env
const secret = Buffer.from(TWITCH_EXTENSION_SECRET, 'base64')

axios.defaults.headers.common['Client-Id'] = TWITCH_CLIENT_ID

const debug = createDebug('vtp')
if (NODE_ENV !== 'production') {
    createDebug.enable('vtp')
}

const PUBSUB_BASE_URL = 'https://api.twitch.tv/extensions/message'
const BROADCAST_TARGET = 'broadcast'
// Only rate limit voting.
// Docs say 1 msg/sec, go with 1 msg/1.5 sec to be safe
const PUBSUB_MSG_INTERVAL = 1500
// Docs say 5 kib, go with 4.5kib to be safe
const MAX_PAYLOAD_SIZE = 1024 * 4.5

// All votes for a channel go here, then are flushed
// every second.
const channelVotes = new Map()

function getChannelVote (channelId) {
    if (!channelVotes.has(channelId)) {
        channelVotes.set(channelId, {
            lastSendDate: null,
            flushTimeoutId: null,
            votes: {} // key = vote, val = count
        })
    }
    return channelVotes.get(channelId)
}

function verifyToken (socket, next) {
    var token = socket.handshake.query.token

    if (!token) { return next(new Error('no token provided')) }

    jwt.verify(token, secret, (err) => {
        if (err) { next(new Error('Failed to authenticate token.')) } else { next() }
    })
}

function createPubSubJwt (channel_id) {
    const payload = {
        channel_id,
        pubsub_perms: {
            send: [BROADCAST_TARGET]
        },
        role: 'external'
    }
    const opts = {
        expiresIn: '1h'
    }
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, opts, (err, token) => {
            if (err) {
                return reject(err)
            }
            resolve(token)
        })
    })
}

async function sendPubSubMessage (channelId, message, res) {
    const pubSubJwt = await createPubSubJwt(channelId)
    const data = {
        content_type: 'application/json',
        targets: [BROADCAST_TARGET],
        message
    }
    const config = {
        headers: {
            Authorization: `Bearer ${pubSubJwt}`,
            'Content-Type': 'application/json'
        }
    }
    const url = `${PUBSUB_BASE_URL}/${channelId}`
    let pubSubResp
    try {
        pubSubResp = await axios.post(url, data, config)
        const h = pubSubResp.headers
        debug('remaining: ' + h['ratelimit-ratelimitermessagesbychannel-remaining'])
    } catch (e) {
        cl(e)
        if (res) {
            res.sendStatus(e.response.status)
        }
        return
    }
    if (res) {
        res.sendStatus(pubSubResp.status)
    }
}

async function getChannel (req, res) {
    const { channelId } = req.params
    const { channelName, game, userId } = req.query
    const channel = await voteModel.getChannel(channelId, channelName, game)
    // Allow getChannel to upsert a vote if channel doesn't exist,
    // before querying the current vote.
    const promises = [
        voteModel.getCurrentVote(channelId),
        voteModel.getUserVote(channelId, userId)
    ]
    const [currentVote, userVote] = await Promise.all(promises)
    res.send({ ...channel, currentVote, userVote })
}

async function startVote (req, res) {
    const { channelId } = req.params
    const { voteCategory, voteMode } = req.body

    const voteId = await voteModel.startVote(channelId, voteCategory, voteMode)

    const channelVote = getChannelVote(channelId)
    channelVote.votes = {} // A new vote has started, remove previous votes

    const message = JSON.stringify({
        type: e.VOTES_START,
        data: { voteCategory, voteMode, voteId }
    })
    sendPubSubMessage(channelId, message, res)
}

// userId is retrieved from the request body instead of jwt
// because I need to use the opaque user Id, not the real ID.
// Twitch recommends keying users by the opaque id. Also,
// I need to mock votes.
async function addVote (req, res) {
    const { channelId } = req.params
    const { userId, vote, voteId } = req.body

    const result = await voteModel.addVote(channelId, vote, userId)
    if (result.modifiedCount === 0) {
        return res.sendStatus(422)
    }

    queueVote(channelId, vote, userId, voteId)
    res.sendStatus(200)
}

function queueVote (channelId, vote, userId, voteId) {
    const channelVote = getChannelVote(channelId)
    const { votes, lastSendDate, flushTimeoutId } = channelVote
    if (!(vote in votes)) {
        votes[vote] = 1
    } else {
        votes[vote]++
    }

    clearTimeout(flushTimeoutId)
    channelVote.flushTimeoutId = setTimeout(() => {
        debug('sendPubSubVote b/c flush timed out')
        sendPubSubVote(channelId, channelVote, voteId)
    }, PUBSUB_MSG_INTERVAL)

    const canSend = !lastSendDate || (new Date() - lastSendDate) > PUBSUB_MSG_INTERVAL

    if (canSend) {
        debug('sendPubSubVote b/c canSend=true')
        sendPubSubVote(channelId, channelVote, voteId)
    }
}

// TODO: make sure payload isn't larger than 5 kib
function sendPubSubVote (channelId, channelVote, voteId) {
    // Flush pending votes
    const votesToSend = channelVote.votes
    if (Object.keys(votesToSend).length === 0) {
        debug('no votes to send, returning')
        return
    }
    channelVote.votes = {}

    const message = JSON.stringify({
        type: e.VOTES_ADD,
        data: { votes: votesToSend, voteId }
    })

    channelVote.lastSendDate = new Date()
    sendPubSubMessage(channelId, message)
}

async function editWhitelist (req, res) {
    const { channelId } = req.params
    let { whitelist } = req.body

    await voteModel.saveGameWhitelist(channelId, whitelist)
    whitelist = await voteModel.getWhitelist(channelId)
    const message = JSON.stringify({
        type: e.WHITELIST,
        data: whitelist
    })
    sendPubSubMessage(channelId, message, res)
}

async function editHearthstoneDecks (req, res) {
    const { channelId } = req.params
    let { decks } = req.body

    await gameModel.saveHearthstoneDecks(channelId, decks)
    decks = await gameModel.getHearthstoneDecks(channelId)

    const message = JSON.stringify({
        type: e.HEARTHSTONE_DECKS,
        data: decks
    })
    sendPubSubMessage(channelId, message, res)
}

function broadcasterOnly (req, res, next) {
    const { channelId } = req.params
    // Use real twitch user Id instead of opaque twitch Id
    const { user_id, role } = req.decodedJwt
    if (channelId === user_id && role === 'broadcaster') {
        next()
    } else {
        res.sendStatus(403)
    }
}

module.exports = (app) => {
    const CHANNEL_ROUTE = '/api/channels/:channelId'

    app.get(CHANNEL_ROUTE, getChannel)
    app.post(`${CHANNEL_ROUTE}/votes`, addVote)

    app.post(`${CHANNEL_ROUTE}/vote`, broadcasterOnly, startVote)
    app.post(`${CHANNEL_ROUTE}/whitelist`, broadcasterOnly, editWhitelist)
    app.post(`${CHANNEL_ROUTE}/hs_decks`, broadcasterOnly, editHearthstoneDecks)

    app.post('/api/channels/23435553/fakevotes', addFakeVote)
}

async function addFakeVote (req, res) {
    const channelId = '23435553'
    const { userId, vote, voteId } = req.body
    const result = await voteModel.addFakeVote(channelId, vote, userId)
    // cl(result)
    if (result.modifiedCount === 0) {
        return res.sendStatus(422)
    }

    // const message = JSON.stringify({
    // 	type: e.VOTES_ADD,
    // 	data: { vote, userId }
    // })
    queueVote(channelId, vote, userId, voteId)
    res.sendStatus(200)
}
