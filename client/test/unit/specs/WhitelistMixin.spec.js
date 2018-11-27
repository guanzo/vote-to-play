import { mutations,actions,  getters } from '@/store/modules/games/util/whitelistMixin'

function mockCandidates(){
    return [{ name: 'axe' },{ name: 'mirana' },{ name: 'toad' },]
}

describe('whitelistMixin',()=>{
    describe('mutations',()=>{


        it('swaps candidate between white/black list',()=>{
            const [mirana,toad] = mockCandidates()
            const state = {
                tempWhitelist:[mirana],
                tempBlacklist:[toad],
            }
            const params = {
                candidate: mirana,
                toArray: state.tempBlacklist,
                fromArray: state.tempWhitelist
            }
            mutations.swap(state,params)
            expect(state.tempWhitelist).to.not.include(mirana)
            expect(state.tempBlacklist).to.have.members([mirana,toad])
        })
        it('swaps all candidates between white/black list',()=>{
            const [axe,mirana,toad] = mockCandidates()
            const state = {
                tempWhitelist:[mirana,axe],
                tempBlacklist:[toad],
            }
            const params = {
                toArray: state.tempBlacklist,
                fromArray: state.tempWhitelist
            }
            mutations.swapAll(state,params)
            expect(state.tempWhitelist).to.be.empty
            expect(state.tempBlacklist).to.have.members([axe,mirana,toad])
        })
        it('removes unsaved changes',()=>{
            const [axe,mirana,toad] = mockCandidates()
            const state = {
                whitelistedNames:['axe','toad'],
                tempWhitelist:[axe,mirana],
                tempBlacklist:[toad],
            }
            mutations.removeUnsavedChanges(state)
            expect(state.tempWhitelist).to.have.members([axe, toad])
            expect(state.tempBlacklist).to.have.members([mirana])
        })
    })
    describe('actions',()=>{
        const [axe,mirana,toad] = mockCandidates()

        const store = new Vuex.Store({
            state: {
                candidates: [axe,mirana,toad],
                whitelistedNames:['axe','mirana'],
                tempWhitelist:[],
                tempBlacklist:[],
            },
            mutations,
            actions,
            getters:{ candidates: state=>state.candidates }
        })
        it('partitions candidates into white/black list',()=>{
            store.dispatch('partition')
            expect(store.state.tempWhitelist).to.have.members([axe,mirana])
            expect(store.state.tempBlacklist).to.have.members([toad])
        })
    })
    describe('getters',()=>{
        describe('whitelistedCandidates',()=>{
            it('correctly filters for whitelisted candidates',()=>{
                const candidates = [{ name: 'axe' },{ name: 'mirana' },{ name: 'bob' }]
                const whitelistedNames = ['mirana','bob']

                const result = getters.whitelistedCandidates({ whitelistedNames },{candidates})

                expect(result).to.have.members(candidates.slice(1))
            })
        })
    })
})
