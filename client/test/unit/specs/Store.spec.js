import * as MUTATIONS from '@/store/mutations'
import { mutations, getters } from '@/store'

var selectedCandidateResetTest = () => {
    const state = { selectedCandidate: { name:'yo' } }
    mutations[MUTATIONS.SET_GAME](state, {game: ''})
    expect(Object.keys(state.selectedCandidate).length).to.equal(0)
}

describe('mutations',()=>{
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