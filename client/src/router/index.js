import Viewer from '@/components/viewer/Viewer'
import Config from '@/components/config/Config'
import LiveConfig from '@/components/liveConfig/LiveConfig'
import Router from 'vue-router'
import Vue from 'vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: { template: '<div></div>'}
        },
        {
            path: '/*/viewer.html',
            component: Viewer
        },
        {
            path: '/*/config.html',
            component: Config
        },
        {
            path: '/*/liveconfig.html',
            component: LiveConfig
        },
    ],
    mode: 'history'
})
