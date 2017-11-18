import LiveConfig from '@/components/liveconfig/LiveConfig'
import { SET_GAME } from '@/store/mutations'
import { ALL_GAMES } from '@/store/modules/games/allGames'
import { state, mutations, getters, actions } from '@/store'

const unsupportedGame = 'werwetds'
function mockStore(selectedGame, voteCategory){
    return new Vuex.Store({
        state: Object.assign({},state, {selectedGame, voteCategory}),
        mutations,
        actions,
        getters
    })
}

const Constructor = Vue.extend(LiveConfig)

describe('LiveConfig.vue', () => {

    it('hides start button and informs streamer if game is unsupported AND voteCategory is unsupported', () => {
        const vm = new Constructor({
            store: mockStore(unsupportedGame, unsupportedGame)
        }).$mount()
        let unsupportedComponent = vm.$el.querySelector('.game-unsupported')
        let startButton = vm.$el.querySelector('.start-vote')

        expect(unsupportedComponent).to.not.be.null
        expect(startButton).to.be.null
    })
    it('does not hide start button if game is unsupported AND voteCategory is all games', () => {
        const vm = new Constructor({
            store: mockStore(unsupportedGame, ALL_GAMES)
        }).$mount()
        let startButton = vm.$el.querySelector('.start-vote')

        expect(startButton).to.not.be.null
    }) 
    it('does not change vote category when game is set on page load', (done) => {
        let game = 'Dota 2'
        let voteCategory = game
        const vm = new Constructor({
            store: mockStore(null, voteCategory)
        }).$mount()
        vm.$store.commit(SET_GAME, { game })
        
        setTimeout(()=>{//let vm watcher trigger
            expect(vm.$store.state.voteCategory).to.equal(voteCategory)
            done()
        },0)
    })
    it('changes vote category when game is changed during broadcast', done => {
        let game = 'Dota 2'
        let voteCategory = game
        let newGame = 'Overwatch'
        const vm = new Constructor({
            store: mockStore(game, voteCategory)
        }).$mount()
        vm.$store.commit(SET_GAME, { game: newGame })
        
        setTimeout(()=>{//let vm watcher trigger
            expect(vm.$store.state.voteCategory).to.equal(newGame)
            done()
        },0)
    })
}) 

