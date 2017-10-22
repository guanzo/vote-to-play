import Viewer from '@/components/viewer/Viewer'
import Config from '@/components/config/Config'
import LiveConfig from '@/components/liveConfig/LiveConfig'

export default new VueRouter({
    routes: [
        {
            path: '/',
            component: { template: '<div></div>'}
        },
        {
            path: '*/viewer.html',
            component: Viewer
        },
        {
            path: '*/config.html',
            component: Config
        },
        {
            path: '*/liveconfig.html',
            component: LiveConfig
        },
    ],
    mode: 'history'
})
