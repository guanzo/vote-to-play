import API from './api'
import store from '@/store'
import * as M from '@/store/mutations'
import { NAMESPACE as NS_HS } from '@/store/modules/games/hearthstone'
import { NAMESPACE as NS_AG } from '@/store/modules/games/allGames'

/**
 * Fetches initial state for
 * - current vote
 * - current whitelist
 * - hearthstone decks, if applicable
 */
async function getInitialState () {
	const {
		channelId,
		channelName,
		selectedGame: game,
		userId
	} = store.state

	if (!channelId || !channelName) {
		throw new Error('Missing required data for fetching initial state.')
	}

	const url = `channels/${channelId}`
	const opts = {
		params: { channelName, game, userId }
	}
	const resp = await API.get(url, opts)

	const { currentVote, userVote, whitelist, hearthstoneDecks } = resp.data
	store.commit(M.SET_CURRENT_VOTE, currentVote)
	store.commit(M.SET_USER_VOTE, userVote)
	store.commit(M.SET_WHITELIST, whitelist)
	if (hearthstoneDecks) {
		store.commit(`${NS_HS}/${M.SET_HEARTHSTONE_DECKS}`, hearthstoneDecks)
	}
}

/**
 * Instead of the server extracting the userId from the jwt,
 * send the userId in the request body so I can mock votes.
 */
async function addVote (userId, vote) {
	const { channelId } = store.state
	const { voteId } = store.state.currentVote
	const url = `channels/${channelId}/votes`
	try {
		await API.post(url, { userId, vote, voteId })
	} catch (err) {
		throw err
	}
	store.commit(M.SET_USER_VOTE, vote)

}

function startVote () {
	const { channelId, voteCategory, voteMode } = store.state
	const url = `channels/${channelId}/vote`
	const data = { voteCategory, voteMode }
	return API.post(url, data)
}

function saveGameWhitelist (whitelist) {
	const { channelId } = store.state
	const { voteCategory, names } = whitelist
	const props = ['id','name']
	//i dont want to fetch img for each game dynamically, just save the img link
	if(voteCategory === NS_AG) {
		props.push('img')
	}

	whitelist.names = names.map(d=>_.pick(d,props))

	const url = `channels/${channelId}/whitelist`
	const data = { whitelist }
	return API.post(url, data)
}

function onVoteStart (currentVote) {
	store.commit(M.SET_CURRENT_VOTE, currentVote)
	store.commit(M.SET_USER_VOTE, null)
}

/**
 * Handles anything vote related
 */
export default {
	getInitialState,
	addVote,
	startVote,
	saveGameWhitelist,
	onVoteStart
}
