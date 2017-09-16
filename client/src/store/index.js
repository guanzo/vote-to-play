
import Vuex from 'vuex'
import Vue from 'vue'
import axios from 'axios'
import _ from 'lodash'
import throttledQueue from 'throttled-queue';

Vue.use(Vuex)

import * as MUTATIONS from './mutations'
import * as ACTIONS from './actions'

import dota from './modules/dota'
import ow from './modules/ow'
import lol from './modules/lol'
import io from 'socket.io-client'

const VOTE_INACTIVE = 'VOTE_INACTIVE'
const VOTE_ACTIVE = 'VOTE_ACTIVE'

import isUndefined from 'lodash/isUndefined'

const socket = io(process.env.SERVER_URL)

 
const store = new Vuex.Store({
    state: {
        isAuthed: false,
        selectedGame: 'Dota 2',
        channelId: -1,
        userId: -1,
        voteType: '',
        votes:[]
    },
    modules:{
        dota,
        ow,
        lol
    },
    mutations: {
        [MUTATIONS.SET_GAME]( state, payload ){
            state.selectedGame = payload.game
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
        [MUTATIONS.START_NEW_VOTE]( state, payload ){
            state.votes = []
        },
    },
    actions:{
        [ACTIONS.VOTE]( {state}, payload ){
            socket.emit('vote',{
                senderId: socket.id,
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
                senderId: socket.id
             })
        },
    },
    getters:{
        userSubmittedVote: state => {
            return !isUndefined(state.votes.find(vote=>vote.userId == state.userId))
        }
    }
})

let maxCalls = 1000;
let interval = 1000;
var throttle = throttledQueue(maxCalls, interval);

function setSocketListeners(channelId){
    
    socket.on(`vote`, data => {
        throttle(function(){
            store.commit(MUTATIONS.SET_VOTES, data)
        })
    });

    socket.on(`start-vote`, data => {
        store.commit(MUTATIONS.START_NEW_VOTE)
    });

}

export default store