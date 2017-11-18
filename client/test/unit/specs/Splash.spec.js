import Splash  from '@/components/viewer/voter/Splash'
import splashTransition from '@/components/viewer/voter/SplashTransition'


let duration = splashTransition().duration

describe('Splash.vue', ()=>{
    
    it('ends transition immediately if splash image fails to load', function(done){
        this.timeout(100)
        let srcThatWillFail = 'fdaosfosdifn'
        let options = splashTransition();
        
        const Constructor = Vue.extend(Splash)
        const vm = new Constructor({
            propsData: {
                splashTransition: options,
                selectedCandidate: {
                    imgSplash: srcThatWillFail
                }
            }
        }).$mount()

        options.isActive = true

        vm.$on('transitionDone',done)
    })
})

