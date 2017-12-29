import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import whitelistMixin from './util/whitelistMixin';
import gameOptions,{ FILTER_MODE_REMOVE } from './util/gameOptions'
import { getActiveFilters } from '@/util'

export const NAMESPACE = 'World of Tanks'

const worldoftanks = _.merge({
    namespaced: true,
    state: { 
        gameName: NAMESPACE,
        candidateNomenclature: 'tank',
        className: 'world-of-tanks',
		gameOptions: gameOptions({ 
			showNameInGrid: true,
			filterMode: FILTER_MODE_REMOVE,
			hasPaginatedGrid: true,
			sortBy: 'tier',
			sortOrder: 'desc'
		}),
		candidates: [],
        filters:[
            {
                id:'name',
                type: 'text',
                vmodel:'',
                placeholder: 'Search tank name'
            },
            {
                id:'tier',
                type: 'select',
                vmodel:'Tier',
                options:[
                    'Tier'
                ]
            },
            {
                id:'nation',
                type: 'select',
                vmodel:'Nation',
                options:[
                    'Nation'
                ]
            },
            {
                id:'type',
                type: 'select',
                vmodel:'Type',
                options:[
                    'Type'
                ]
            }
        ]
    },
    mutations:{
        [MUTATIONS.SET_CANDIDATES](state, { candidates }){
            state.candidates = candidates
        },
        [MUTATIONS.SET_FILTERS](state, { candidates }){
            let tiers = _(candidates).map(d=>d.tier).uniq().sort((a,b)=>a-b).value()
            state.filters[1].options.push(...tiers)
            let nations = _(candidates).map(d=>d.nation).uniq().sort().value()
            state.filters[2].options.push(...nations)
            let types = _(candidates).map(d=>d.type).uniq().sort().value()
            state.filters[3].options.push(...types)
        },
        
    },
    actions:{
        [ACTIONS.GET_CANDIDATES]({rootState, commit}){
			return axios.get(process.env.SERVER_URL+'/api/worldoftanks',{
                headers:{
                    'Authorization': rootState.token,
                }
            })
            .then((response)=>{
                let candidates = response.data
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
            let data =  candidates.filter(candidate=>{
                let result = true;
                activeFilters.forEach(({id,vmodel,options})=>{
                    if(id == 'name')
                        result = result && candidate.name.toLowerCase().includes(vmodel.toLowerCase())
					else if(id == 'tier'   && vmodel !== options[0])
						result = result && candidate.tier === parseInt(vmodel)
                    else if(id == 'nation' && vmodel !== options[0])
						result = result && candidate.nation === vmodel
					else if(id == 'type'   && vmodel !== options[0])
                        result = result && candidate.type === vmodel
                })
                return result
			})
			return data
        },
    }
},whitelistMixin)

export default worldoftanks
