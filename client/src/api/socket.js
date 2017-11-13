
import store from '@/store'
import * as MUTATIONS from '@/store/mutations'

const socket = io(process.env.SERVER_URL)

export default {
    addVote(data){
        socket.emit('add-vote',data)
    },
    startVote(data){
        socket.emit('start-vote',data)
    },
    //get initial state for stream
    joinChannel(data){
        setListeners(data.channelId)
        socket.emit('join-channel',data)
    },
}

let maxCalls = 1000;
let interval = 1250;
var throttle = throttledQueue(maxCalls, interval);

function setListeners(channelId){

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