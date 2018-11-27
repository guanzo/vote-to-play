import store from '@/store'

const { SERVER_URL } = process.env
const baseURL = `${SERVER_URL}/api`
const API = initAPI({ baseURL })

function initAPI (config) {
    const instance = axios.create(config)
    store.watch(state => state.token, token => {
        const header = 'Bearer ' + token
		instance.defaults.headers.common['Authorization'] = header
	})
	return instance
}

export default API
