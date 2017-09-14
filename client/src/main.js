import App from './App'
import Vue from 'vue'
import router from './router'
import store from './store'
import twitchExt from './assets/js/twitchExt';
import 'bulma'
import 'font-awesome/css/font-awesome.css';

Vue.config.productionTip = false

Vue.use(twitchExt);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
