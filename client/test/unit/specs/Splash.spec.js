import Splash  from '@/components/page-viewer/voter/Splash'
import Voter from '@/components/page-viewer/voter/Voter'

describe('Splash.vue', ()=>{
    
    it('ends transition immediately if splash image fails to load', function(done){
        this.timeout(100)
        let srcThatWillFail = 'fdaosfosdifn'
        let options = Voter.methods.splashTransitionDefaults();
        
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

