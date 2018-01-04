import socket from './socket'
import store from '@/store'
import * as MUTATIONS from '@/store/mutations'
const e = require('@shared/socket-events')

import { NAMESPACE as HEARTHSTONE } from '@/store/modules/games/hearthstone'

/**
 * Handles game specific requests
 */
export default {
	fetch(resource){
		let { token } = store.state
		return axios.get(process.env.SERVER_URL+'/api'+resource,{
			headers:{
				'Authorization': token,
			}
		})
	},
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


