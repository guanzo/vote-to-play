import socket from './socket'
import store from '@/store'
import * as MUTATIONS from '@/store/mutations'
const e = require('@shared/socket-events')


/**
 * Handles anything vote related
 */
export default {
    addVote(data){
        socket.get().emit(e.VOTES_ADD,data)
    },
    startVote(data){
        socket.get().emit(e.VOTES_START,data)
    },    
    saveGameWhitelist(data){
        socket.get().emit(e.WHITELIST_EDIT,data)
    },  
    setListeners(){
        /**
         * Retrieves initial state of stream. should only fire once per page load
         */
        socket.get().on(e.VOTES, currentVote => {
            store.commit(MUTATIONS.SET_CURRENT_VOTE, currentVote)
    
            /** v1.4 COMPATIBILITY */
            if(currentVote.hasOwnProperty('voteType') || !currentVote.hasOwnProperty('voteMode')){
                store.dispatch("START_NEW_VOTE")
            }
        });
        
        let maxCalls = 1000;
        let interval = 1250;
        var throttle = throttledQueue(maxCalls, interval);

        socket.get().on(e.VOTES_ADD, vote => {
            throttle(function(){
                store.commit(MUTATIONS.ADD_VOTE, vote)
            })
        });
    
        socket.get().on(e.VOTES_START, currentVote => {
            delete currentVote.channelId
            store.commit(MUTATIONS.SET_CURRENT_VOTE, currentVote)
        });
    
        socket.get().on(e.WHITELIST, whitelist => {
            store.commit(MUTATIONS.SET_WHITELIST, whitelist )
        })
    
    }
}


