import gameApi from '@/api/game'
import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import whitelistMixin from './util/whitelistMixin';
import { gameOptions, gameMixin } from './util/gameMixin'

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
                type:'text',
                vmodel:'',
                placeholder:'Search hero name'
            },
            {
                id:'role',
                type:'select',
                vmodel:'Role',
                options:['Role']
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
        [ACTIONS.GET_CANDIDATES]({commit}){
			return gameApi.fetch('dota')
            .then((response)=>{
                let candidates = _(response.data).map((val,id)=>{
					val.id = id
                    val.img = gameApi.getImagePath(`dota/portraits/${id}_full.png`);
                    val.imgSplash = gameApi.getImagePath(`dota/splash/${id}_splash.jpg`);
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
},gameMixin,whitelistMixin)

export default dota
