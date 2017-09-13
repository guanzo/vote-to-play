import App from './App'
import Vue from 'vue'
import router from './router'
import twitchExt from './assets/js/twitchExt';

Vue.config.productionTip = false
Vue.use(twitchExt);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
