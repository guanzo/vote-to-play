import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import whitelistMixin from './util/whitelistMixin';
import { getActiveFilters } from '@/util'
import gameOptions from './util/gameOptions'

export const NAMESPACE = 'Dota 2'

const dota = _.merge({
    namespaced: true,
    state: { 
        gameName: NAMESPACE,
        candidateNomenclature: 'hero',
		className: 'dota',
		gameOptions: gameOptions(),
        candidates: [],
        filters:[
            {
                id:'name',
                type: 'text',
                vmodel:'',
                placeholder: 'Search hero name'
            },
            {
                id:'role',
                type: 'select',
                vmodel:'Role',
                options:[
                    'Role'
                ]
            }
        ]
    },
    mutations:{
        [MUTATIONS.SET_CANDIDATES](state,{ candidates }){
            state.candidates = candidates
        },
        [MUTATIONS.SET_FILTERS](state, { candidates }){
            let roles = _(candidates).map(d=>d.roles).flatMap().uniq().sort().value()
            state.filters[1].options.push(...roles)
        },
    },
    actions:{
        [ACTIONS.GET_CANDIDATES]({state, rootState, commit}){
            return axios.get(process.env.SERVER_URL+'/api/dota',{
                headers:{
                    'Authorization': rootState.token,
                }
            })
            .then((response)=>{
                let candidates = _(response.data).map((val,id)=>{
                    val.img = cl.url(`dota/portraits/${id}_full.png`);
                    val.imgSplash = cl.url(`dota/splash/${id}_splash.jpg`);
                    return val
                }).sortBy('name').value()
                commit(MUTATIONS.SET_CANDIDATES,{ candidates })
                commit(MUTATIONS.SET_FILTERS,{ candidates })
            })
        }
    },
    getters:{
        candidates(state){
            return state.candidates
        },
        filteredCandidates({candidates, filters}){
			let activeFilters = getActiveFilters(filters)
            return candidates.filter(candidate=>{
                return filters.every(({id,vmodel,options})=>{
                    if(id == 'name')
                        return candidate.name.toLowerCase().includes(vmodel.toLowerCase())
                    else if(id == 'role' && vmodel !== options[0])
						return candidate.roles.includes(vmodel)
					else
						return true
                })
            })
        },
    }
},whitelistMixin)

export default dota
