import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import { mutations, getters } from '@/store'
import mainGameModule from '@/store/modules/games/_main'

describe('store',()=>{
    
    describe('mutations',()=>{
        
        const selectedCandidateResetTest = () => {
            const state = { selectedCandidate: { name:'yo' } }
            mutations[MUTATIONS.SET_GAME](state, {game: ''})
            expect(Object.keys(state.selectedCandidate).length).to.equal(0)
        }

        describe('SET_GAME',()=>{
            it('resets selected candidate',selectedCandidateResetTest)
        })
        describe('SET_VOTE_CATEGORY',()=>{
            it('resets selected candidate',selectedCandidateResetTest)
        })
        describe('START_NEW_VOTE',()=>{
            it('resets selected candidate',selectedCandidateResetTest)
        })
    })

    describe('getters',()=>{
        describe('userVote',()=>{
            it('returns null if user has not voted',()=>{
                const state = { userId: -1, currentVote: {votes:[ { userId: 5 } ] }}
                const userVote = getters.userVote(state)
                expect(userVote).to.be.null
            })
            it('returns name of vote candidate if user has voted',()=>{
                const vote = 'axe'
                const state = { userId: -1, currentVote: {votes:[ { userId: -1, vote } ] }}
                const userVote = getters.userVote(state)
                expect(userVote).to.equal(vote)
            })
        })
    })

    describe('gameModule',()=>{
        const gameModules = _.omit(mainGameModule.modules,'All Games')
        const types = gameModuleRequiredProperties();

        _.each(gameModules,(gameModule)=>{
            it(gameModule.state.gameName + ' implements the game interface',()=>{
                comparePropertyTypes(types,gameModule)
            })
        })

    })

})

function comparePropertyTypes(source,target) {
    for (const property in source) {
        if (source.hasOwnProperty(property)) {

            expect(target).to.have.property(property)

            const sourceValue = source[property]//stringified type
            const targetValue = target[property]//value

            if(Array.isArray(sourceValue))
                expect(targetValue).to.be.an('array', `Property '${property}'`)
            else if (typeof sourceValue === "object")
                comparePropertyTypes(sourceValue, targetValue);
            else
                expect(typeof targetValue).to.equal(sourceValue, `Property '${property}'`)
        }
    }
}


/**
 * Ghetto interface
 * Used for unit testing.
 * Each supported game (except for ALL_GAMES) 
 * should at least contain these store properties
 */
function gameModuleRequiredProperties(){
    return {
        namespaced: "boolean",
        state:{
            gameName: "string",
            className: 'string',
            gameOptions: "object",
            candidates: [],
            whitelistedNames:[],
            filters: [],
        },
        mutations:{
            [MUTATIONS.SET_CANDIDATES]: "function"
        },
        actions:{
            [ACTIONS.GET_CANDIDATES]: "function"
        },
        getters:{
            candidates: 'function',
            filteredCandidates: "function",
            whitelistedCandidates: "function"
        }
    }
}
