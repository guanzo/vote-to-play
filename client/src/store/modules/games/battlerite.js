

import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'


export const NAMESPACE = 'Battlerite'

const battlerite = {
    namespaced: true,
    state: { 
        gameName: 'Battlerite',
        candidateNomenclature: 'champion',
        className: 'battlerite',
        maxVoteResults: 5,
        showNameInGrid: false,
        candidates: [],
        whitelist:[],
        filters:[
            {
                id:'name',
                type: 'text',
                vmodel:'',
                placeholder: 'Search champion name'
            },
            {
                id:'role',
                type: 'select',
                vmodel:'Class',
                options:[
                    'Class'
                ]
            }
        ]
    },
    mutations:{
        [MUTATIONS.SET_CANDIDATES](state, { candidates }){
            state.candidates = candidates
            let roles = _(candidates).map(d=>d.class).uniq().sort().value()
            state.filters[1].options.push(...roles)
        },
        
    },
    actions:{
        [ACTIONS.GET_CANDIDATES]({commit}){
            return axios.get('https://www.battlerite.com/api/champions/get')
            .then((response)=>{
                
                let candidates = _(response.data).map((val)=>{
                    val.img = val.icon
                    val.imgSplash = val.image
                    return val
                }).sortBy('name').value()
                commit(MUTATIONS.SET_CANDIDATES,{ candidates })
            })
        }
    },
    getters:{
        filteredCandidates({candidates, filters}){
            return candidates.filter(candidate=>{
                let result = true;
                filters.forEach(({id,vmodel,options})=>{
                    if(id == 'name')
                        result = result && candidate.name.toLowerCase().includes(vmodel.toLowerCase())
                    else if(id == 'role' && vmodel !== options[0])
                        result = result && candidate.class == vmodel
                })
                return result
            })
        }
    }
}




export default battlerite
