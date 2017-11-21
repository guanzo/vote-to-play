import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import { mutations, getters } from '@/store'
import mainGameModule from '@/store/modules/games/_main'
import { whitelistedCandidates } from '@/store/modules/games/_util'

describe('store',()=>{
    
    describe('mutations',()=>{
        
        var selectedCandidateResetTest = () => {
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
                const state = { userId: -1, votes:[ { userId: 5 } ] }
                let userVote = getters.userVote(state)
                expect(userVote).to.be.null
            })
            it('returns name of vote candidate if user has voted',()=>{
                let vote = 'axe'
                const state = { userId: -1, votes:[ { userId: -1, vote } ] }
                let userVote = getters.userVote(state)
                expect(userVote).to.equal(vote)
            })
        })
    })

    describe('gameModule',()=>{
        let gameModules = _.omit(mainGameModule.modules,'All Games')
        var types = gameModuleRequiredProperties();

        _.each(gameModules,(gameModule)=>{
            it(gameModule.state.gameName + ' implements the game interface',()=>{
                comparePropertyTypes(types,gameModule)
            })
        })

        describe('whitelistedCandidates',()=>{
            it('correctly filters for whitelisted candidates',()=>{
                let candidates = [{ name: 'axe' },{ name: 'mirana' },{ name: 'bob' }]
                let whitelistedNames = ['mirana','bob']

                let result = whitelistedCandidates({ candidates, whitelistedNames })

                expect(result).to.have.lengthOf(whitelistedNames.length)
                expect(result).to.have.deep.members(candidates.slice(1))
            })
        })

    })
})

function comparePropertyTypes(source,target) {
    for (var property in source) {
        if (source.hasOwnProperty(property)) {

            expect(target).to.have.property(property)

            let sourceValue = source[property]//stringified type
            let targetValue = target[property]//value

            if(Array.isArray(sourceValue))
                expect(targetValue).to.be.an('array', `Property '${property}'`)
            else if (typeof sourceValue == "object")
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
            maxVoteResults: "number",
            showNameInGrid: "boolean",
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
            filteredCandidates: "function",
            whitelistedCandidates: "function"
        }
    }
}

/* 
const actionsInjector = require('inject-loader!@/store')
//socket.startVote({ channelId: state.channelId, voteCategory: state.voteCategory })
const actions = actionsInjector({
    '@/api/socket': {
        startVote (data) {
            return new Promise(resolve=>{
                setTimeout(() => {
                    resolve(data)
                }, 100)
            })
        }
    }
})
  


describe('actions', () => {
    it('startVote', done => {
        actions.startVote()
    })
}) */