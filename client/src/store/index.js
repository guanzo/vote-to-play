import * as MUTATIONS from './mutations'
import * as ACTIONS from './actions'

import dota from './modules/dota'
import overwatch from './modules/overwatch'
import lol from './modules/lol'
import hearthstone from './modules/hearthstone'
import hots from './modules/hots'

const IS_DEVELOPMENT = process.env.NODE_ENV == 'development'

const socket = io(process.env.SERVER_URL)

const store = new Vuex.Store({
    state: {
        selectedGame: '',
        streamerName: 'The broadcaster',
        channelId: -1,
        userId: -1,
        voteType: null,//not used at the moment.
        votes:[],
        selectedVote:{},
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
        [MUTATIONS.SET_STREAMER_NAME]( state, payload ){
            state.streamerName = payload.streamerName
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
            socket.emit('add-vote',{
                channelId: state.channelId,
                vote: payload.vote,
                userId: payload.userId
            })
        },
        [ACTIONS.SIMULATE_VOTE]( {state}, payload ){
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