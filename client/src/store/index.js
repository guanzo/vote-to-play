import * as MUTATIONS from './mutations'
import * as ACTIONS from './actions'

import voteApi from '@/api/vote'
import games from './modules/games/_main'

const IS_DEVELOPMENT = process.env.NODE_ENV == 'development'

var { VOTE_MODE_VIEWER } = require('@shared/constants')


//potential values will be same as selectedGame, with the addition of "All Games"
const voteCategory = null;
//free-for-all vs whitelisted votes
const voteMode = VOTE_MODE_VIEWER

export const state = {
    channelId: -1,
    channelName: 'The broadcaster',
    userId: -1,
    //set by streamer's game set in dashboard
    selectedGame: null,
    //potential values will be same as selectedGame, with the addition of "All Games"
    voteCategory,
    voteMode,
    selectedCandidate:{},
    currentVote:{
        votes:[],
        voteCategory,
        voteMode,
        createdAt: null,
    },
    isAuthed: false,
    token: null,
    TESTING:{
        IS_DEVELOPMENT,
        isSimulating: false && IS_DEVELOPMENT,
        unlimitedVotes: false && IS_DEVELOPMENT
    }
}

export const mutations = {
    [MUTATIONS.SET_AUTH]( state, payload ){
        state.isAuthed = true;
        state.token = payload.token;
        state.channelId = payload.channelId
        state.channelName = payload.channelName
        state.userId = payload.userId
    },
    [MUTATIONS.SET_GAME]( state, game ){
        state.selectedGame = game
        state.selectedCandidate = {}
    },
    [MUTATIONS.SET_VOTE_CATEGORY]( state, voteCategory ){
        state.voteCategory = voteCategory
        state.selectedCandidate = {}
    },
    [MUTATIONS.SET_VOTE_MODE]( state, voteMode ){
        state.voteMode = voteMode
    },
    [MUTATIONS.SET_CURRENT_VOTE]( state, currentVote ){
        /** v1.4 COMPATIBILITY */
        if(currentVote.hasOwnProperty('voteType') || !currentVote.hasOwnProperty('voteMode')){
            state.voteCategory = state.selectedGame
            state.voteMode = VOTE_MODE_VIEWER
        }else{
            state.voteCategory = currentVote.voteCategory
            state.voteMode = currentVote.voteMode
        }
        Object.assign(state.currentVote,currentVote)
        state.selectedCandidate = {}
    },
    [MUTATIONS.ADD_VOTE]( state, vote ){
        state.currentVote.votes.push(vote)
    },
    [MUTATIONS.SELECT_CANDIDATE]( state, candidate ){
        state.selectedCandidate = candidate
    },
    [MUTATIONS.TOGGLE_VOTE_SIMULATION]( state, payload ){
        state.TESTING.isSimulating = payload
    },
}

export const actions = {
    [ACTIONS.VOTE]( {state}, payload ){
        voteApi.addVote({
            channelId: state.channelId,
            vote: payload.vote,
            userId: payload.userId
        });
    },
    [ACTIONS.SIMULATE_VOTE]( {state}, payload ){
        voteApi.addVote({
            channelId: state.channelId,
            vote: payload.vote,
            userId: payload.userId
        });
    },
    [ACTIONS.START_NEW_VOTE]( {state} ){
        voteApi.startVote({ 
            channelId: state.channelId, 
            voteCategory: state.voteCategory, 
            voteMode: state.voteMode,
            createdAt: new Date(),
            votes: [],
        })
    },
    [MUTATIONS.SET_AUTH]( {state,commit}, payload ){
        commit(MUTATIONS.SET_AUTH, payload)
        voteApi.connect(process.env.SERVER_URL, payload)
    },
}

export const getters = {
    userVote(state){
        let userVote = state.currentVote.votes.find(vote=>vote.userId == state.userId)
        if( !_.isUndefined(userVote) )
            return userVote.vote
        else
            return null;
    },
    hasSubmittedVote(state,getters){
        if(state.TESTING.unlimitedVotes)
            return false
        else
            return getters.userVote != null
    },
    hasSelectedCandidate (state){
        return !_.isEmpty(state.selectedCandidate);
    }
}

export const modules = {
    games
}

const store = new Vuex.Store({
    state, 
    mutations,
    actions,
    getters,
    modules
})

export default store