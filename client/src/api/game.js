import socket from './socket'
import store from '@/store'
import * as MUTATIONS from '@/store/mutations'
const e = require('@shared/socket-events')

import { NAMESPACE as HEARTHSTONE } from '@/store/modules/games/hearthstone'

export default {
    addHearthstoneDeck(data){
        socket.get().emit(e.HEARTHSTONE_DECKS_EDIT,data)
    },
    deleteHearthstoneDeck(data){
        socket.get().emit(e.DELETE_HEARTHSTONE_DECK,data)
    },
    setListeners(){
        socket.get().on(e.HEARTHSTONE_DECKS, decks => {
            store.commit(HEARTHSTONE+'/'+MUTATIONS.SET_HEARTHSTONE_DECKS, decks)
    
        });
        
    
    }
}


