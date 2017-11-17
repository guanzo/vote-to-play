import LiveConfig from '@/components/liveconfig/LiveConfig'

import { ALL_GAMES } from '@/store/modules/games/allGames'

const unsupportedGame = 'werwetds'

function mockStoreWithVoteCategory(voteCategory){
    return new Vuex.Store({
        state:{
            selectedGame: unsupportedGame,
            voteCategory,
            allGames:{
                gameName: ALL_GAMES
            }
        },
        getters:{
            supportedGames(){
                return ['test1','test2','test3']
            }
        }
    })
}

describe('LiveConfig.vue', () => {

    it('hides start button and informs streamer if game is unsupported AND voteCategory is unsupported', () => {
        const Constructor = Vue.extend(LiveConfig)
        const vm = new Constructor({
            store: mockStoreWithVoteCategory(unsupportedGame)
        }).$mount()
        let unsupportedComponent = vm.$el.querySelector('.game-unsupported')
        let startButton = vm.$el.querySelector('.start-vote')
        expect(unsupportedComponent).to.not.be.null
        expect(startButton).to.be.null
    })
    it('does not hide start button if game is unsupported AND voteCategory is all games', () => {
        const Constructor = Vue.extend(LiveConfig)
        const vm = new Constructor({
            store: mockStoreWithVoteCategory(ALL_GAMES)
        }).$mount()
        let startButton = vm.$el.querySelector('.start-vote')
        expect(startButton).to.not.be.null
    })
})

