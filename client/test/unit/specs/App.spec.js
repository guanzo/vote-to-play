
import App from '@/App'


describe('App.vue', () => {
    it('should have id of app', () => {
        const router = new VueRouter({
            routes: []
        });
        App.router = router
        const Constructor = Vue.extend(App)
        const vm = new Constructor().$mount()
        expect(vm.$el.id).to.equal('app')
    })
})
