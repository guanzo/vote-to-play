

import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import whitelistMixin from './util/whitelistMixin';
import { gameOptions, gameMixin } from './util/gameMixin'


export const NAMESPACE = 'Battlerite'

const battlerite = _.merge({
    namespaced: true,
    state: { 
        gameName: 'Battlerite',
        candidateNomenclature: 'champion',
        className: 'battlerite',
		gameOptions: gameOptions(),
        candidates: [],
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
        },
        [MUTATIONS.SET_FILTERS](state, { candidates }){
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
					
					delete val.icon
					delete val.image
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
                        return candidate.class === vmodel
                })
            })
        },
    }
},gameMixin, whitelistMixin)

export default battlerite
