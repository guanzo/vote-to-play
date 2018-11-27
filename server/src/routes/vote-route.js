const axios = require('axios')
const RateLimiter = require('limiter').RateLimiter

const voteModel = require('../models/vote-model')
const gameModel = require('../models/game-model')
const jwt = require('jsonwebtoken');
const e = require('../../../shared/pubsub-events')

const { TWITCH_EXTENSION_SECRET, TWITCH_CLIENT_ID } = process.env
const secret = Buffer.from(TWITCH_EXTENSION_SECRET, 'base64')

axios.defaults.headers.common['Client-Id'] = TWITCH_CLIENT_ID

const cl = console.log
const PUBSUB_BASE_URL = 'https://api.twitch.tv/extensions/message'
const BROADCAST_TARGET = 'broadcast'
// Only rate limit voting.
// Docs say 1 msg/sec, go with 1 msg/1.25 sec to be safe
const PUBSUB_MSG_INTERVAL = 1250
// Docs say 5 kib, go with 4.5kib to be safe
const MAX_PAYLOAD_SIZE = 1024 * 4.5

// All votes for a channel go here, then are flushed
// every second.
const channelVotes = new Map()

function getChannelVote (channelId) {
	if (!channelVotes.has(channelId)) {
		channelVotes.set(channelId, {
			limiter: new RateLimiter(1, PUBSUB_MSG_INTERVAL),
			votes: {} // key = vote, val = count
		})
	}
	return channelVotes.get(channelId)
}

function verifyToken(socket,next){
    var token = socket.handshake.query.token

    if(!token)
        return next(new Error('no token provided'));

    jwt.verify(token, secret, (err) => {
        if (err)
            next(new Error('Failed to authenticate token.'));
        else
            next();
    })
}

function createPubSubJwt (channel_id) {
	const payload = {
		channel_id,
		pubsub_perms: {
			send:[BROADCAST_TARGET]
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
		});
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
		cl('---------rate limit ----------')
		cl(h['ratelimit-ratelimitermessagesbychannel-limit'])
		cl(h['ratelimit-ratelimitermessagesbychannel-remaining'])
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
	const promises = [
		voteModel.getChannel(channelId, channelName, game),
		voteModel.getCurrentVote(channelId),
		voteModel.getUserVote(channelId, userId)
	]
	const [channel, currentVote, userVote] = await Promise.all(promises)
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

	let result = await voteModel.addVote(channelId, vote, userId)
	if(result.modifiedCount === 0) {
		return res.sendStatus(422)
	}

	queueVote(channelId, vote, userId, voteId)
	res.sendStatus(200)
}

function queueVote (channelId, vote, userId, voteId) {
	const channelVote = getChannelVote(channelId)
	const { votes, limiter } = channelVote
	if (!(vote in votes)) {
		votes[vote] = 1
	} else {
		votes[vote]++
	}
	console.log('queuedVote')
	console.log(JSON.stringify(votes, null, 4))
	limiter.removeTokens(1, function(err, remainingRequests) {
		console.log('limiter fired, remaining: ' + remainingRequests)
		// Flush pending votes
		const votesToSend = channelVote.votes
		channelVote.votes = {}

		const message = JSON.stringify({
			type: e.VOTES_ADD,
			data: { votes: votesToSend, voteId }
		})
		sendPubSubMessage(channelId, message)
	});
	// TODO: make sure payload isn't larger than 5 kib
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
	const { user_id, role } = req.decodedJwt
	if (channelId === user_id && role === 'broadcaster') {
		next()
	} else {
		res.sendStatus(403)
	}
}

module.exports = (server, app) => {
	const CHANNEL_ROUTE = '/api/channels/:channelId'

	app.get(CHANNEL_ROUTE, getChannel)
	app.post(`${CHANNEL_ROUTE}/votes`, addVote)

	app.post(`${CHANNEL_ROUTE}/vote`, broadcasterOnly, startVote)
	app.post(`${CHANNEL_ROUTE}/whitelist`, broadcasterOnly, editWhitelist)
	app.post(`${CHANNEL_ROUTE}/hs_decks`, broadcasterOnly, editHearthstoneDecks)

	app.post(`/api/channels/23435553/fakevotes`, addFakeVote)

	// KEEP SOCKET.IO CODE UNTIL NEW VERSION IS RELEASED
	var io = require('socket.io')(server)

	io.origins('*:*')
    io.use(verifyToken)

    io.on('connection', async (socket)=>{

        var query = socket.handshake.query

        socket.on(e.CHANNELS_JOIN,async data=>{
            let { channelId, channelName, game } = data
			socket.join(channelId)
            let channel = await voteModel.getChannel(channelId, channelName, game)
            socket.emit(e.VOTES,channel.currentVote)
            socket.emit(e.WHITELIST,channel.whitelist)

            if(channel.hasOwnProperty('hearthstoneDecks'))
                socket.emit(e.HEARTHSTONE_DECKS,channel.hearthstoneDecks)
		})

        socket.on(e.VOTES_ADD,async data=>{
			const { channelId, vote, userId } = data
            let result = await voteModel.addVote(channelId, vote, userId)
            if(result.modifiedCount === 0)
                return;

            io.to(channelId).emit(e.VOTES_ADD, { vote, userId } )
        })

        if(query.role === 'broadcaster'){

            socket.on(e.VOTES_START, async data => {
				const { channelId, voteCategory, voteMode } = data
                await voteModel.startVote(channelId, voteCategory, voteMode)
                io.to(data.channelId).emit(e.VOTES_START,data)
			})

            socket.on(e.WHITELIST_EDIT, async data => {
				const { channelId, gameWhitelist } = data
                await voteModel.saveGameWhitelist(channelId, gameWhitelist)
                let whitelist = await voteModel.getWhitelist(channelId)
                io.to(data.channelId).emit(e.WHITELIST,whitelist)
            })

            socket.on(e.HEARTHSTONE_DECKS_EDIT, async data => {
				let { channelId, decks } = data
                await gameModel.saveHearthstoneDecks(channelId, decks)
                decks = await gameModel.getHearthstoneDecks(channelId)
                io.to(data.channelId).emit(e.HEARTHSTONE_DECKS,decks)
            })

        }
    });

};

async function addFakeVote (req, res) {
	const { channelId } = req.params
	const { userId, vote } = req.body

	let result = await voteModel.addFakeVote(channelId, vote, userId)
	console.log(result)
	if(result.modifiedCount === 0) {
		return res.sendStatus(422)
	}

	// const message = JSON.stringify({
	// 	type: e.VOTES_ADD,
	// 	data: { vote, userId }
	// })
	queueVote(channelId, { vote, userId })
	res.sendStatus(200)
}
