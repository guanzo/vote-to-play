
import store from '@/store'
import * as MUTATIONS from '@/store/mutations'

var socket;

export default {
    connect(data){
        socket = io(process.env.SERVER_URL,{ query: data })
        setListeners()
        socket.emit('channels/join',data)
    },
    addVote(data){
        socket.emit('votes/add',data)
    },
    startVote(data){
        socket.emit('votes/start',data)
    },    
}

let maxCalls = 1000;
let interval = 1250;
var throttle = throttledQueue(maxCalls, interval);

function setListeners(){
    /**
     * Retrieves initial state of stream. should only fire once per page load
     */
    socket.on(`votes`, data => {
        store.commit(MUTATIONS.SET_CURRENT_VOTE, data)
    });
    
    socket.on(`votes/add`, data => {
        throttle(function(){
            store.commit(MUTATIONS.ADD_VOTE, data)
        })
    });

    socket.on(`votes/start`, data => {
        store.commit(MUTATIONS.START_NEW_VOTE, data)
    });

    socket.on('whitelist', data => {
        store.commit(MUTATIONS.SET_WHITELIST, data )
    })

    socket.on('error',console.error)

}