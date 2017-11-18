import * as MUTATIONS from './mutations'
import * as ACTIONS from './actions'

import voteApi       from '@/api/vote'
import dota         from './modules/games/dota'
import overwatch    from './modules/games/overwatch'
import lol          from './modules/games/lol'
import hearthstone  from './modules/games/hearthstone'
import hots         from './modules/games/hots'
import battlerite   from './modules/games/battlerite'
import allGames         from './modules/games/allGames'

const IS_DEVELOPMENT = process.env.NODE_ENV == 'development'

export const state = {
    channelId: -1,
    channelName: 'The broadcaster',
    userId: -1,
    selectedGame: null,
    voteCategory: null,//either selectedGame or 'All Games'
    votes:[],
    selectedCandidate:{},
    createdAt: null,
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
    [MUTATIONS.SET_GAME]( state, { game } ){
        state.selectedGame = game
        state.selectedCandidate = {}
    },
    [MUTATIONS.SET_VOTE_CATEGORY]( state, { voteCategory } ){
        state.voteCategory = voteCategory
        state.selectedCandidate = {}
    },
    [MUTATIONS.SET_CURRENT_VOTE]( state, payload ){
        state.voteCategory = payload.voteCategory
        state.votes = payload.votes;
        state.createdAt = payload.createdAt
    },
    [MUTATIONS.ADD_VOTE]( state, payload ){
        state.votes.push(payload.data)
    },
    [MUTATIONS.START_NEW_VOTE]( state, { voteCategory } ){
        state.votes = []
        state.voteCategory = voteCategory
        state.selectedCandidate = {}
    },
    [MUTATIONS.SELECT_CANDIDATE]( state, { candidate } ){
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
        voteApi.startVote({ channelId: state.channelId, voteCategory: state.voteCategory })
    },
    [MUTATIONS.SET_AUTH]( {state,commit}, payload ){
        commit(MUTATIONS.SET_AUTH, payload)
        voteApi.connect(payload)
    },
}

export const getters = {
    supportedGames: state => {
        return   _(state)
                .pickBy((val,key)=>{
                    return val && !_.isUndefined(val.gameName)
                })
                .map('gameName')
                .value()
    },
    game: state => {
        return _.find(state, (val,key)=>{
            if(!val || !val.gameName)
                return false;
            return val.gameName == state.voteCategory
        })
    },
    userVote: state => {
        let userVote = state.votes.find(vote=>vote.userId == state.userId)
        if( !_.isUndefined(userVote) )
            return userVote.vote
        else
            return null;
    },
    hasSubmittedVote: (state,getters) => {
        if(state.TESTING.unlimitedVotes)
            return false
        else
            return getters.userVote != null
    },
    hasSelectedCandidate : state => {
        return !_.isEmpty(state.selectedCandidate);
    }
}

const store = new Vuex.Store({
    state, 
    modules:{
        dota,
        overwatch,
        lol,
        hearthstone,
        hots,
        battlerite,
        allGames
    },
    mutations,
    actions,
    getters
})

export default store