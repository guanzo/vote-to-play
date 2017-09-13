import Hello from '@/components/Hello'
import Viewer from '@/components/Viewer'
import LiveConfig from '@/components/LiveConfig'
import Router from 'vue-router'
import Vue from 'vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: Hello
        },
        {
            path: '/viewer.html',
            component: Viewer
        },
        {
            path: '/liveconfig.html',
            component: LiveConfig
        },
    ],
    mode: 'history'
})
