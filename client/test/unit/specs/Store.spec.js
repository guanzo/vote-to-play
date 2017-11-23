import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import { mutations, getters } from '@/store'
import mainGameModule from '@/store/modules/games/_main'
import whitelistMixin from '@/store/modules/games/util/whitelistMixin'

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

        describe('whitelistMixin',()=>{
            describe('mutations',()=>{
                let axe =    { name: 'axe' },
                    mirana = { name: 'mirana' },
                    toad =   { name: 'toad' }
                it('partitions candidates into white/black list',()=>{
                    let state = {
                        candidates: [axe,mirana,toad],
                        whitelistedNames:['axe','mirana'],
                        tempWhitelist:[],
                        tempBlacklist:[],
                    }
                    whitelistMixin.mutations.partition(state)
                    expect(state.tempWhitelist).to.have.members([axe,mirana])
                    expect(state.tempBlacklist).to.have.members([toad])
                })
                it('swaps candidate between white/black list',()=>{
                    let state = {
                        tempWhitelist:[mirana],
                        tempBlacklist:[{name:'frog'}],
                    }
                    let params = {
                        candidate: mirana,
                        toArray: state.tempBlacklist,
                        fromArray: state.tempWhitelist
                    }
                    whitelistMixin.mutations.swap(state,params)
                    expect(state.tempWhitelist).to.not.include(mirana)
                    expect(state.tempBlacklist).to.include(mirana)
                })
                it('removes unsaved candidates',()=>{
                    let state = {
                        whitelistedNames:['axe'],
                        tempWhitelist:[axe,mirana],
                        tempBlacklist:[],
                    }
                    whitelistMixin.mutations.removeUnsavedWhitelist(state)
                    expect(state.tempWhitelist).to.have.members([axe])
                    expect(state.tempBlacklist).to.have.members([mirana])
                })
            })
            describe('getters',()=>{
                describe('whitelistedCandidates',()=>{
                    it('correctly filters for whitelisted candidates',()=>{
                        let candidates = [{ name: 'axe' },{ name: 'mirana' },{ name: 'bob' }]
                        let whitelistedNames = ['mirana','bob']
    
                        let result = whitelistMixin.getters.whitelistedCandidates({ candidates, whitelistedNames })
    
                        expect(result).to.have.members(candidates.slice(1))
                    })
                })
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
