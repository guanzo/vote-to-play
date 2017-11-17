

import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'

export const NS_BR = 'battlerite'

const battlerite = {
    namespaced: true,
    state: { 
        gameName: 'Battlerite',
        characterNomenclature: 'champion',
        maxResults: 5,
        heroes: []
    },
    mutations:{
        [MUTATIONS.SET_HEROES](state, { heroes }){
            state.heroes = heroes
        }
    },
    actions:{
        [ACTIONS.GET_HEROES]({commit}){
            axios.get('https://www.battlerite.com/api/champions/get')
            .then((response)=>{
                
                let heroes = _.map(response.data,(val)=>{
                    val.img = val.icon
                    val.imgSplash = val.image
                    return val
                })
                commit(MUTATIONS.SET_HEROES,{ heroes })
            })
        }
    }
}




export default battlerite
