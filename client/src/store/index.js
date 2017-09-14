
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

const socket = io('https://localhost:3001')

const store = new Vuex.Store({
    state: {
        games: gamesJson.games,
        selectedGame: checkForSelectedGame(),
        channelId: 0,
        userId: 0,
        voteStatus: VOTE_INACTIVE,
        voteType: '',
        votes:[]
    },
    modules:{
        dota
    },
    mutations: {
        [MUTATIONS.SET_GAME]( state, payload ){
            state.selectedGame = payload.game

            localStorage.setItem('selectedGame', payload.game);
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
            state.voteStatus = VOTE_ACTIVE
        },
    },
    actions:{
        [ACTIONS.VOTE]( {state}, payload ){
            socket.emit('vote',{
                channelId: state.channelId,
                vote: payload.vote,
                userId: state.userId
            })
        },
        [ACTIONS.SELECT_GAME]( {state}, { game } ){
            socket.emit('select-game', { channelId: state.channelId, game })
        },
        [ACTIONS.START_VOTE]( {state} ){
            socket.emit('start-vote',{ channelId: state.channelId })
        },
        [MUTATIONS.SET_AUTH]( {state,commit}, payload ){
            commit(MUTATIONS.SET_AUTH, payload)
            setSocketListeners(payload.channelId)
        },
    }
})

function setSocketListeners(channelId){

    socket.on(`vote:${channelId}`, function (data) {
        store.commit(MUTATIONS.SET_VOTES, data)
    });

    socket.on(`select-game:${channelId}`, function (data) {
        store.commit(MUTATIONS.SET_GAME, data)
    });

}

function checkForSelectedGame(){
    if (localStorage.getItem('selectedGame') !== null) {
        return localStorage.getItem('selectedGame')
    }
}

export default store