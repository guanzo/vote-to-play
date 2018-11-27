import API from './api'
import store from '@/store'

const { SERVER_URL } = process.env

/**
 * Handles game specific requests
 */
export default {
	fetch(resource){
		return API.get(resource)
	},
	fetchJson(resource){
		return axios.get(`${SERVER_URL}/static/json/${resource}`)
	},
	getImagePath(path){
		return SERVER_URL + '/static/images/' + path
	},
	async setHearthstoneDecks(decks) {
		const { channelId } = store.state
		const url = `channels/${channelId}/hs_decks`
		const data = { decks }
		const resp = await API.post(url, data)
		cl(resp)
    },
}
