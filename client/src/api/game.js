import socket from './socket'
import store from '@/store'
import * as MUTATIONS from '@/store/mutations'
const e = require('@shared/socket-events')


export default {
    addHearthstoneDeck(data){
        socket.get().emit(e.ADD_HEARTHSTONE_DECK,data)
    },
    deleteHearthstoneDeck(data){
        socket.get().emit(e.DELETE_HEARTHSTONE_DECK,data)
    },
    setListeners(){
        socket.get().on(e.HEARTHSTONE_DECKS, decks => {
            store.commit(MUTATIONS.SET_HEARTHSTONE_DECKS, decks)
    
        });
        
    
    }
}


