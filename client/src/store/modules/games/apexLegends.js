import gameApi from '@/api/game-api'
import * as M from '@/store/mutations'
import * as A from '@/store/actions'
import whitelistMixin from './util/whitelistMixin';
import { gameOptions, gameMixin } from './util/gameMixin'

export const NAMESPACE = 'Apex Legends'

const apexLegends = _.merge({},gameMixin,whitelistMixin,{
    namespaced: true,
    state: {
        gameName: NAMESPACE,
        candidateNomenclature: 'legend',
		className: 'apex-legends',
		gameOptions: gameOptions({
			showNameInGrid: true
		}),
        candidates: [],
        filters:[
            {
                id:'name',
                type:'text',
                vmodel:'',
                placeholder:'Search legends'
            },
        ]
    },
    mutations:{
        [M.SET_CANDIDATES](state,{ candidates }){
            state.candidates = candidates
        },
        // [M.SET_FILTERS](state, { candidates }){
        //     const roles = _(candidates).map(d=>d.roles).flatMap().uniq().sort().value()
        //     state.filters[1].options.push(...roles)
        // },
    },
    actions:{
        async [A.GET_CANDIDATES]({commit}){
			const resp = await gameApi.fetch('apexlegends')

			const candidates = resp.data
			commit(M.SET_CANDIDATES,{ candidates })
			commit(M.SET_FILTERS,{ candidates })
        }
    },
    getters:{
        candidates(state){
            return state.candidates
		},
        filteredCandidates({candidates}, {activeFilters}){
            return candidates.filter(candidate=>{
                return activeFilters.every(({id,vmodel,options})=>{
                    if(id === 'name')
                        return candidate.name.toLowerCase().includes(vmodel.toLowerCase())
                    else if(id === 'role' && vmodel !== options[0])
						return candidate.roles.includes(vmodel)
                })
            })
        },
    }
})

export default apexLegends
