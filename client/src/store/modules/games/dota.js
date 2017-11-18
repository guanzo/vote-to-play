import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'

export const NAMESPACE = 'Dota 2'

const dota = {
    namespaced: true,
    state: { 
        gameName: NAMESPACE,
        candidateNomenclature: 'hero',
        maxResults: 5,
        candidates: []
    },
    mutations:{
        [MUTATIONS.SET_CANDIDATES](state,{ candidates }){
            state.candidates = candidates
        }
    },
    actions:{
        [ACTIONS.GET_CANDIDATES]({state, rootState, commit}){
            axios.get(process.env.SERVER_URL+'/api/heroes/dota',{
                headers:{
                    'Authorization': rootState.token,
                }
            })
            .then((response)=>{

                let candidates = _(response.data).map((val,id)=>{
                    val.img = cl.url(`dota/portraits/${id}_sb.png`);
                    val.imgSplash = cl.url(`dota/splash/${id}_splash.jpg`);
                    return val
                }).sortBy('name').value()
                commit(MUTATIONS.SET_CANDIDATES,{ candidates })
            })
        }
    }
}

export default dota
