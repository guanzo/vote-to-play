import * as M from './mutations'

import games from './modules/games/_main'

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

const { VOTE_MODE_VIEWER, NO_GAME } = require('@shared/constants')

//potential values will be same as selectedGame, with the addition of "All Games"
const voteCategory = null
//free-for-all vs whitelisted votes
const voteMode = VOTE_MODE_VIEWER

// When user clears their game selection,
// the twitch API channel game endpoint returns null
// the twitch JS client context callback returns ''
const hasNoGameSelection = game => game === null || game === ''

export const state = {
    isAuthed: false,
    token: null,
    channelId: -1,
    channelName: 'The broadcaster',
    userId: -1,
    //set by streamer's game set in dashboard
    selectedGame: null,
    //potential values will be same as selectedGame, with the addition of "All Games"
    voteCategory,
    voteMode,
	selectedCandidate:{},
	userVote: null,
    currentVote:{
        votes:[],
        voteCategory,
        voteMode,
    },
    TESTING:{
        IS_DEVELOPMENT,
        isSimulating: false && IS_DEVELOPMENT,
        unlimitedVotes: false && IS_DEVELOPMENT
    }
}

export const mutations = {
    [M.SET_AUTH]( state, payload ){
        state.isAuthed = true;
        state.token = payload.token;
        state.channelId = payload.channelId
        state.channelName = payload.channelName
        state.userId = payload.userId
    },
    [M.SET_GAME]( state, game ){
		if (hasNoGameSelection(game)) {
			game = NO_GAME
		}
        state.selectedGame = game
        state.selectedCandidate = {}
    },
    [M.SET_VOTE_CATEGORY]( state, voteCategory ){
		if (hasNoGameSelection(voteCategory)) {
			voteCategory = NO_GAME
		}
        state.voteCategory = voteCategory
        state.selectedCandidate = {}
    },
    [M.SET_VOTE_MODE]( state, voteMode ){
        state.voteMode = voteMode
	},
	// REMEMBER that a pubsub message for a vote can trigger
	// before the initiate state is fetched, so instead of
	// overwriting the currentVote, merge and increment.
	// Make sure to check the Id of the current vote, to see
	// if you should merge, or overwrite.
    [M.SET_CURRENT_VOTE]( state, currentVote ){
		state.currentVote.votes = []
        state.selectedCandidate = {}
        state.voteCategory = currentVote.voteCategory
        state.voteMode = currentVote.voteMode
		Object.assign(state.currentVote, currentVote)
	},
	[M.SET_USER_VOTE]( state, userVote ){
		state.userVote = userVote
    },
    [M.ADD_VOTE]( state, payload ){
		const { currentVote } = state
		const currentVoteId = currentVote.voteId
		// Is an array of obj, { vote, count }
		const currentVotes = currentVote.votes
		// Is an obj with key=vote, val=count
		const newVotes = payload.votes
		const newVoteId = payload.voteId
		if (newVoteId !== currentVoteId) {
			return
		}

		// Update existing votes
		for (const voteObj of currentVotes) {
			const { vote } = voteObj
			if (vote in newVotes) {
				voteObj.count += newVotes[vote]
				delete newVotes[vote]
			}
		}
		// Add new votes
		for (const [vote, count] of Object.entries(newVotes)) {
			currentVotes.push({ vote, count })
		}
    },
    [M.SELECT_CANDIDATE]( state, candidate ){
        state.selectedCandidate = candidate
    },
    [M.TOGGLE_VOTE_SIMULATION]( state, payload ){
        state.TESTING.isSimulating = payload
    },
}

export const getters = {
    // userVote(state){
	// 	const { userId } = state
	// 	const { votes } = state.currentVote
    //     const userVote = votes.find(vote => vote.userId === userId)

	// 	if( !_.isUndefined(userVote) )
    //         return userVote.vote
    //     else
    //         return null;
    // },
    hasSubmittedVote(state){
        if(state.TESTING.unlimitedVotes)
            return false
        else
            return state.userVote !== null
    },
    hasSelectedCandidate(state){
        return !_.isEmpty(state.selectedCandidate);
    },
    /*
    Twitch Docs:
    An opaque ID that begins with “A” is a logged-out user and should not be persisted.
    It will change every time the logged-out user loads your extension.

    They are NOT ALLOWED to vote.
    */
    isAnonymousUser(state){
        return state.userId.charAt(0) === 'A'
    }
}

export const modules = {
    games
}

const store = new Vuex.Store({
    state,
    mutations,
    getters,
    modules
})

export default store
