
import store from '@/store'
import * as MUTATIONS from '@/store/mutations'
const e = require('@shared/socket-events')

var socket;

export default {
    connect(url,data){
        socket = io(url,{ query: data })
        setListeners()
        socket.emit(e.CHANNELS_JOIN,data)
    },
    addVote(data){
        socket.emit(e.VOTES_ADD,data)
    },
    startVote(data){
        socket.emit(e.VOTES_START,data)
    },    
    saveGameWhitelist(data){
        socket.emit(e.WHITELIST_EDIT,data)
    }
}

let maxCalls = 1000;
let interval = 1250;
var throttle = throttledQueue(maxCalls, interval);

function setListeners(){
    /**
     * Retrieves initial state of stream. should only fire once per page load
     */
    socket.on(e.VOTES, currentVote => {
        store.commit(MUTATIONS.SET_CURRENT_VOTE, currentVote)

        /** v1.4 COMPATIBILITY */
        if(currentVote.hasOwnProperty('voteType') || !currentVote.hasOwnProperty('voteMode')){
            store.dispatch("START_NEW_VOTE")
        }
    });
    
    socket.on(e.VOTES_ADD, vote => {
        throttle(function(){
            store.commit(MUTATIONS.ADD_VOTE, vote)
        })
    });

    socket.on(e.VOTES_START, voteInstance => {
        store.commit(MUTATIONS.START_NEW_VOTE, voteInstance)
    });

    socket.on(e.WHITELIST, whitelist => {
        store.commit(MUTATIONS.SET_WHITELIST, whitelist )
    })

    socket.on('error',console.error)

}