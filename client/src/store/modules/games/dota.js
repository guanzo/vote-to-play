


import util from '@/util'
import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'

export const NAMESPACE_DOTA = 'dota'


const dota = {
    namespaced: true,
    state: { 
        gameName: 'Dota 2',
        characterNomenclature: 'hero',
        maxResults: 5,
        heroes: []
    },
    mutations:{
        [MUTATIONS.SET_HEROES](state,{ heroes }){
            state.heroes = heroes
        }
    },
    actions:{
        [ACTIONS.GET_HEROES]({state, rootState, commit}){
            axios.get(process.env.SERVER_URL+'/api/heroes/dota',{
                headers:{
                    'Authorization': rootState.token,
                }
            })
            .then((response)=>{

                let heroes = _.map(response.data,(val,id)=>{
                    val.id = id
                    val.img = cl.url(`dota/portraits/${id}_sb.png`);
                    val.imgSplash = cl.url(`dota/splash/${id}_splash.jpg`);
                    return val
                })
                commit(MUTATIONS.SET_HEROES,{ heroes })
            })
        }
    }
}

export default dota
