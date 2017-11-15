
import store from '@/store'
import * as MUTATIONS from '@/store/mutations'

var socket;

export default {
    connect(data){
        socket = io(process.env.SERVER_URL,{ query: data })
        setListeners()
        socket.emit('join-channel',data)
    },
    addVote(data){
        socket.emit('add-vote',data)
    },
    startVote(data){
        socket.emit('start-vote',data)
    },    
}

let maxCalls = 1000;
let interval = 1250;
var throttle = throttledQueue(maxCalls, interval);

function setListeners(){

    socket.on(`all-votes`, data => {
        store.commit(MUTATIONS.SET_CURRENT_VOTE, data)
    });
    
    socket.on(`add-vote`, data => {
        throttle(function(){
            store.commit(MUTATIONS.ADD_VOTE, { data })
        })
    });

    socket.on(`start-vote`, data => {
        store.commit(MUTATIONS.START_NEW_VOTE, data)
    });

    socket.on('error',console.error)

}