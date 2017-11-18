

import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'

export const NS_BR = 'battlerite'

const battlerite = {
    namespaced: true,
    state: { 
        gameName: 'Battlerite',
        candidateNomenclature: 'champion',
        maxResults: 5,
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
                
                let candidates = _.map(response.data,(val)=>{
                    val.img = val.icon
                    val.imgSplash = val.image
                    return val
                })
                commit(MUTATIONS.SET_CANDIDATES,{ candidates })
            })
        }
    }
}




export default battlerite
