import socket from './socket'
import store from '@/store'
import * as MUTATIONS from '@/store/mutations'
const e = require('@shared/socket-events')//keep this before hearthstone namespace import
import { NAMESPACE as HEARTHSTONE } from '@/store/modules/games/hearthstone'

const SERVER_URL = process.env.SERVER_URL

/**
 * Handles game specific requests
 */
export default {
	fetch(resource){
		let { token } = store.state
		return axios.get(`${SERVER_URL}/api/${resource}`,{
			headers:{
				'Authorization': token,
			}
		})
	},
	fetchJson(resource){
		return axios.get(`${SERVER_URL}/static/json/${resource}`)
	},
	getImagePath(path){
		return SERVER_URL + '/static/images/' + path
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


