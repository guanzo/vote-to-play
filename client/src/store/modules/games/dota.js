import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import whitelistMixin from './util/whitelistMixin';


export const NAMESPACE = 'Dota 2'

const dota = _.merge({
    namespaced: true,
    state: { 
        gameName: NAMESPACE,
        candidateNomenclature: 'hero',
        className: 'dota',
        maxVoteResults: 5,
        showNameInGrid: false,
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
            return axios.get(process.env.SERVER_URL+'/api/heroes/dota',{
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
            return candidates.filter(candidate=>{
                let result = true;
                filters.forEach(({id,vmodel,options})=>{
                    if(id == 'name')
                        result = result && candidate.name.toLowerCase().includes(vmodel.toLowerCase())
                    else if(id == 'role' && vmodel !== options[0])
                        result = result && candidate.roles.includes(vmodel)
                })
                return result
            })
        },
    }
},whitelistMixin)

export default dota
