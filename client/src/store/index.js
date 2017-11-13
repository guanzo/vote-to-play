import * as MUTATIONS from './mutations'
import * as ACTIONS from './actions'

import socket from '@/api/socket'
import dota from './modules/dota'
import overwatch from './modules/overwatch'
import lol from './modules/lol'
import hearthstone from './modules/hearthstone'
import hots from './modules/hots'

const IS_DEVELOPMENT = process.env.NODE_ENV == 'development'

const store = new Vuex.Store({
    state: {
        selectedGame: '',
        channelName: 'The broadcaster',
        channelId: -1,
        userId: -1,
        voteType: null,//not used at the moment.
        votes:[],
        selectedVote:{},
        createdAt: null,
        isAuthed: false,
        token: null,
        TESTING:{
            IS_DEVELOPMENT,
            isSimulating: false && IS_DEVELOPMENT,
            unlimitedVotes: false && IS_DEVELOPMENT
        }
    },
    modules:{
        dota,
        overwatch,
        lol,
        hearthstone,
        hots
    },
    mutations: {
        [MUTATIONS.SET_GAME]( state, payload ){
            state.selectedGame = payload.game
        },
        [MUTATIONS.SET_CHANNEL_NAME]( state, payload ){
            state.channelName = payload.channelName
        },
        [MUTATIONS.SET_AUTH]( state, payload ){
            state.isAuthed = true;
            state.token = payload.token;
            state.channelId = payload.channelId
            state.userId = payload.userId
        },
        [MUTATIONS.SET_VOTES]( state, payload ){
            state.voteType = payload.voteType
            state.votes = payload.votes;
            state.createdAt = payload.createdAt
        },
        [MUTATIONS.ADD_VOTE]( state, payload ){
            state.votes.push(payload.data)
        },
        [MUTATIONS.START_NEW_VOTE]( state ){
            state.votes = []
        },
        [MUTATIONS.TOGGLE_VOTE_SIMULATION]( state, payload ){
            state.TESTING.isSimulating = payload
        },
        [MUTATIONS.SELECT_GAME]( state, payload ){
            state.selectedGame = payload.game
        },
        [MUTATIONS.SELECT_VOTE]( state, payload ){
            state.selectedVote = payload.vote
        } 
    },
    actions:{
        [ACTIONS.VOTE]( {state}, payload ){
            socket.addVote({
                channelId: state.channelId,
                vote: payload.vote,
                userId: payload.userId
            });
        },
        [ACTIONS.SIMULATE_VOTE]( {state}, payload ){
            socket.addVote({
                channelId: state.channelId,
                vote: payload.vote,
                userId: payload.userId,
                isSimulated: true
            });
        },
        [ACTIONS.START_NEW_VOTE]( {state} ){
            socket.startVote({ channelId: state.channelId, channelName: state.channelName })
        },
        [MUTATIONS.SET_AUTH]( {state,commit}, payload ){
            commit(MUTATIONS.SET_AUTH, payload)
            socket.joinChannel({ channelId: payload.channelId })
        },
    },
    getters:{
        getSupportedGames: state => {
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
                return val.gameName == state.selectedGame
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
        hasSelectedVote : state => {
            return !_.isEmpty(state.selectedVote);
        }
    }
})

export default store