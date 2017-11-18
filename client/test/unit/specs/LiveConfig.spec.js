import LiveConfig from '@/components/liveconfig/LiveConfig'
import { SET_GAME } from '@/store/mutations'
import { ALL_GAMES } from '@/store/modules/games/allGames'
import { mutations, getters } from '@/store'
const unsupportedGame = 'werwetds'

function mockStore(game, voteCategory){
    return new Vuex.Store({
        state:{
            selectedGame: game,
            voteCategory,
            allGames:{
                gameName: ALL_GAMES
            }
        },
        mutations,
        getters
    })
}


describe('LiveConfig.vue', () => {

    it('hides start button and informs streamer if game is unsupported AND voteCategory is unsupported', () => {
        const Constructor = Vue.extend(LiveConfig)
        const vm = new Constructor({
            store: mockStore(unsupportedGame, unsupportedGame)
        }).$mount()
        let unsupportedComponent = vm.$el.querySelector('.game-unsupported')
        let startButton = vm.$el.querySelector('.start-vote')

        expect(unsupportedComponent).to.not.be.null
        expect(startButton).to.be.null
    })
    it('does not hide start button if game is unsupported AND voteCategory is all games', () => {
        const Constructor = Vue.extend(LiveConfig)
        const vm = new Constructor({
            store: mockStore(unsupportedGame, ALL_GAMES)
        }).$mount()
        let startButton = vm.$el.querySelector('.start-vote')

        expect(startButton).to.not.be.null
    })
    it('does not change vote category when game is set on page load', () => {
        let game = 'Dota 2'
        let voteCategory = ALL_GAMES
        const Constructor = Vue.extend(LiveConfig)
        const vm = new Constructor({
            store: mockStore(null, voteCategory)
        }).$mount()
        vm.$store.commit(SET_GAME, { game })
        
        expect(vm.$store.state.voteCategory).to.equal(voteCategory)
    })
    it('changes vote category when game is changed during broadcast', () => {
        let game = 'Dota 2'
        let voteCategory = game
        let newGame = 'Overwatch'
        const Constructor = Vue.extend(LiveConfig)
        const vm = new Constructor({
            store: mockStore(game, voteCategory)
        }).$mount()
        vm.$store.commit(SET_GAME, { game: newGame })
        
        //let vm watcher trigger
        setTimeout(()=>{
            expect(vm.$store.state.voteCategory).to.equal(newGame)
        },0)
    })
}) 

