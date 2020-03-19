import API from './api'
import store from '@/store'

const baseUrl = process.env.VUE_APP_API_URL

/**
 * Handles game specific requests
 */
export default {
	fetch(resource){
		return API.get(resource)
	},
	fetchJson(resource){
		return axios.get(`${baseUrl}/static/json/${resource}`)
	},
	getImagePath(path){
		return baseUrl + '/static/images/' + path
	},
	async setHearthstoneDecks(decks) {
		const { channelId } = store.state
		const url = `channels/${channelId}/hs_decks`
		const data = { decks }
		const resp = await API.post(url, data)
		cl(resp)
    },
}
