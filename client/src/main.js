

import App from './App'
import router from './router'
import store from './store'
import './assets/js/twitchExt';
import '@/style/_style.scss';

Vue.config.devtools = process.env.NODE_ENV == 'development' ? true : false
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
