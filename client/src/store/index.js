
import Vuex from 'vuex'
import Vue from 'vue'
import axios from 'axios'

Vue.use(Vuex)

import * as MUTATIONS from './mutations'
import * as ACTIONS from './actions'

import dota from './modules/dota'
import io from 'socket.io-client'

const VOTE_INACTIVE = 'VOTE_INACTIVE'
const VOTE_ACTIVE = 'VOTE_ACTIVE'

import gamesJson from '@/assets/json/games'
import isUndefined from 'lodash/isUndefined'

const socket = io('https://localhost:3001')

socket.on('connect',()=>{
    console.log('CONNECTED: ' + socket.id)
})

const store = new Vuex.Store({
    state: {
        games: gamesJson.games,
        selectedGame: 'Dota 2',
        channelId: -1,
        userId: -1,
        isActiveVote: false,
        voteType: '',
        votes:[]
    },
    modules:{
        dota
    },
    mutations: {
        [MUTATIONS.SET_GAME]( state, payload ){
            state.selectedGame = payload.game
        },
        [MUTATIONS.SET_AUTH]( state, payload ){
            state.channelId = payload.channelId
            state.userId = payload.userId
        },
        [MUTATIONS.SET_VOTES]( state, payload ){
            state.voteType = payload.voteType
            state.votes = payload.votes;
        },
        [MUTATIONS.START_VOTE]( state ){
            state.isActiveVote = true
            state.votes = []
        },
    },
    actions:{
        [ACTIONS.VOTE]( {state}, payload ){
            socket.emit('vote',{
                senderId: socket.id,
                channelId: state.channelId,
                vote: payload.vote,
                userId: state.userId
            })
        },
        [ACTIONS.START_VOTE]( {state} ){
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

function setSocketListeners(channelId){
    
    socket.on(`vote`, data => {
        store.commit(MUTATIONS.SET_VOTES, data)
    });

    socket.on(`start-vote`, data => {
        store.commit(MUTATIONS.START_VOTE)
    });

}

export default store