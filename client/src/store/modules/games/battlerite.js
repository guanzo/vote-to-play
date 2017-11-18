

import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'

export const NAMESPACE = 'Battlerite'

const battlerite = {
    namespaced: true,
    state: { 
        gameName: 'Battlerite',
        candidateNomenclature: 'champion',
        maxVoteResults: 5,
        candidates: []
    },
    mutations:{
        [MUTATIONS.SET_CANDIDATES](state, { candidates }){
            state.candidates = candidates
        }
    },
    actions:{
        [ACTIONS.GET_CANDIDATES]({commit}){
            axios.get('https://www.battlerite.com/api/champions/get')
            .then((response)=>{
                
                let candidates = _(response.data).map((val)=>{
                    val.img = val.icon
                    val.imgSplash = val.image
                    return val
                }).sortBy('name').value()
                commit(MUTATIONS.SET_CANDIDATES,{ candidates })
            })
        }
    }
}




export default battlerite
