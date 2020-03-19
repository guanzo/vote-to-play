import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import './assets/js/twitchExt'
import './api/api'
import '@/assets/scss/index.scss'

Sentry.init({
    dsn: 'https://cb098d4aef4e4ce386fd5e630998314e@sentry.io/5166821',
    enabled: (process.env.NODE_ENV === 'production'),
})

window.cl = console.log

Vue.config.devtools = process.env.NODE_ENV === 'development'
Vue.config.productionTip = false

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})
