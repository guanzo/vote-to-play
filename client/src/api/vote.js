
import store from '@/store'
import * as MUTATIONS from '@/store/mutations'

var socket;

export default {
    connect(url,data){
        socket = io(url,{ query: data })
        setListeners()
        socket.emit('channels/join',data)
    },
    addVote(data){
        socket.emit('votes/add',data)
    },
    startVote(data){
        socket.emit('votes/start',data)
    },    
    saveGameWhitelist(data){
        socket.emit('whitelist/edit',data)
    }
}

let maxCalls = 1000;
let interval = 1250;
var throttle = throttledQueue(maxCalls, interval);

function setListeners(){
    /**
     * Retrieves initial state of stream. should only fire once per page load
     */
    socket.on(`votes`, currentVote => {
        store.commit(MUTATIONS.SET_CURRENT_VOTE, currentVote)
    });
    
    socket.on(`votes/add`, vote => {
        throttle(function(){
            store.commit(MUTATIONS.ADD_VOTE, vote)
        })
    });

    socket.on(`votes/start`, voteInstance => {
        store.commit(MUTATIONS.START_NEW_VOTE, voteInstance)
    });

    socket.on('whitelist', whitelist => {
        store.commit(MUTATIONS.SET_WHITELIST, whitelist )
    })

    socket.on('error',console.error)

}