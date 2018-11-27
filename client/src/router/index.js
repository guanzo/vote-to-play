import Viewer from '@/components/page-viewer/Viewer'
import Config from '@/components/page-config/Config'
import LiveConfig from '@/components/page-liveconfig/LiveConfig'

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
