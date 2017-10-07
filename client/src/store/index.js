
import Vuex from 'vuex'
import Vue from 'vue'
import axios from 'axios'
import _ from 'lodash'
import throttledQueue from 'throttled-queue';
import io from 'socket.io-client'

Vue.use(Vuex)

import * as MUTATIONS from './mutations'
import * as ACTIONS from './actions'

import dota from './modules/dota'
import overwatch from './modules/overwatch'
import lol from './modules/lol'
import hearthstone from './modules/hearthstone'

const IS_DEVELOPMENT = process.env.NODE_ENV == 'development'

const socket = io(process.env.SERVER_URL)

const store = new Vuex.Store({
    state: {
        isAuthed: false,
        selectedGame: '',
        streamerName: 'The broadcaster',
        channelId: -1,
        userId: -1,
        voteType: null,//not used at the moment.
        votes:[],
        TESTING:{
            isSimulating: false && IS_DEVELOPMENT,
            unlimitedVotes: false && IS_DEVELOPMENT
        }
    },
    modules:{
        dota,
        overwatch,
        lol,
        hearthstone
    },
    mutations: {
        [MUTATIONS.SET_GAME]( state, payload ){
            state.selectedGame = payload.game
        },
        [MUTATIONS.SET_STREAMER_NAME]( state, payload ){
            state.streamerName = payload.streamerName
        },
        [MUTATIONS.SET_AUTH]( state, payload ){
            state.isAuthed = true;
            state.channelId = payload.channelId
            state.userId = payload.userId
        },
        [MUTATIONS.SET_VOTES]( state, payload ){
            state.voteType = payload.voteType
            state.votes = payload.votes;
        },
        [MUTATIONS.ADD_VOTE]( state, payload ){
            state.votes.push(payload.data)
        },
        [MUTATIONS.START_NEW_VOTE]( state, payload ){
            state.votes = []
            state.userVote = null
        },
    },
    actions:{
        [ACTIONS.VOTE]( {state, commit}, payload ){
            socket.emit('add-vote',{
                channelId: state.channelId,
                vote: payload.vote,
                userId: payload.userId
            })
        },
        [ACTIONS.SIMULATE_VOTE]( {state, commit}, payload ){
            socket.emit('add-vote',{
                channelId: state.channelId,
                vote: payload.vote,
                userId: payload.userId
            })
        },
        [ACTIONS.START_NEW_VOTE]( {state} ){
            socket.emit('start-vote',{ channelId: state.channelId })
        },
        [MUTATIONS.SET_AUTH]( {state,commit}, payload ){
            commit(MUTATIONS.SET_AUTH, payload)
            setSocketListeners(payload.channelId)

            //get initial state for stream
            socket.emit('join-channel',{ 
                channelId: payload.channelId,
             })
        },
    },
    getters:{
        gameIsSupported: state => {

        },
        getSelectedGameModule: state => {
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
        userSubmittedVote: (state,getters) => {
            if(state.TESTING.unlimitedVotes)
                return false
            else
                return getters.userVote != null
        }
    }
})

let maxCalls = 1000;
let interval = 1250;
var throttle = throttledQueue(maxCalls, interval);

function setSocketListeners(channelId){
    
    socket.on(`all-votes`, data => {
        store.commit(MUTATIONS.SET_VOTES, data)
    });
    
    socket.on(`add-vote`, data => {
        throttle(function(){
            store.commit(MUTATIONS.ADD_VOTE, { data })
        })
    });

    socket.on(`start-vote`, data => {
        store.commit(MUTATIONS.START_NEW_VOTE)
    });

}

export default store