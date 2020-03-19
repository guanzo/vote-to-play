import store from '@/store'

const baseURL = `${process.env.VUE_APP_API_URL}/api`
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
