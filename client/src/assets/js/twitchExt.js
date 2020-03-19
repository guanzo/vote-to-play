
import store from '@/store'
import voteApi from '@/api/vote-api'
import { NAMESPACE as NS_HS } from '@/store/modules/games/hearthstone'
import {
    SET_AUTH,
    SET_GAME,
    ADD_VOTE,
    SET_WHITELIST,
    SET_HEARTHSTONE_DECKS
} from '@/store/mutations'
const events = require('@shared/pubsub-events')

// fires on load && when user grants permission
window.Twitch.ext.onAuthorized(async auth => {
    const parts = auth.token.split('.')
    const payload = JSON.parse(window.atob(parts[1]))
    const { role } = payload
    const { channelId, token, userId } = auth

    const promises = [
        getChannelName(channelId),
        getSelectedGame(channelId)
    ]
    const [channelName, game] = await Promise.all(promises)

    store.commit(SET_GAME, game)
    // Send the current game to server to set vote category
    // in case this is the first visit to a channel that doesn't exist in the database
    store.commit(SET_AUTH, {
        channelId,
        channelName,
        token,
        userId,
        role
    })
})

// Prevent duplicate listeners due to HMR
window.Twitch.ext.unlisten('broadcast', listenCb)
window.Twitch.ext.listen('broadcast', listenCb)

// The backend writes to Twitch PubSub, which triggers
// this callback.
function listenCb (target, contentType, message) {
    const { type, data } = JSON.parse(message)
    // cl(type, data, 'ewewwesertfrere')
    switch (type) {
    case events.VOTES_ADD:
        store.commit(ADD_VOTE, data)
        break
    case events.VOTES_START:
        voteApi.onVoteStart(data)
        break
    case events.WHITELIST:
        store.commit(SET_WHITELIST, data)
        break
    case events.HEARTHSTONE_DECKS:
        store.commit(`${NS_HS}/${SET_HEARTHSTONE_DECKS}`, data)
        break
    }
}

window.Twitch.ext.onContext((context, changed) => {
    if (!changed.includes('game')) {
        return
    }
    const { game } = context
    store.commit(SET_GAME, game)
})

window.Twitch.ext.onError(console.error)

async function getSelectedGame (channelId) {
    const url = `https://api.twitch.tv/kraken/channels/${channelId}`
    const response = await axios.get(url, {
        headers: {
            Accept: 'application/vnd.twitchtv.v5+json',
            'Client-ID': process.env.VUE_APP_EXTENSION_CLIENT_ID
        }
    })
    return response.data.game
}

async function getChannelName (channelId) {
    const url = `https://api.twitch.tv/helix/users?id=${channelId}`
    const response = await axios.get(url, {
        headers: {
            'Client-Id': process.env.VUE_APP_EXTENSION_CLIENT_ID
        }
    })
    return response.data.data[0].display_name
}
