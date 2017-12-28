import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import whitelistMixin from './util/whitelistMixin';


export const NAMESPACE = 'World of Tanks'

//world of tanks api key
const APP_ID = '6c5d8b04c80f28bb3f65de25d9d6ff0e'
const API_URL = `https://api.worldoftanks.com/wot/encyclopedia/vehicles/`
const IMG_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/'
const IMG_SPLASH_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/'

const wot = _.merge({
    namespaced: true,
    state: { 
        gameName: NAMESPACE,
        candidateNomenclature: 'tank',
        className: 'world-of-tanks',
        maxVoteResults: 5,
        showNameInGrid: true,
        candidates: [],
        filters:[
            {
                id:'name',
                type: 'text',
                vmodel:'',
                placeholder: 'Search tank name'
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
        [MUTATIONS.SET_CANDIDATES](state, { candidates }){
            state.candidates = candidates
        },
        [MUTATIONS.SET_FILTERS](state, { candidates }){
            let roles = _(candidates).map(d=>d.roles).flatMap().uniq().sort().value()
            state.filters[1].options.push(...roles)
        },
        
    },
    actions:{
        [ACTIONS.GET_CANDIDATES]({commit}){
            return axios.get(API_URL,{
				params:{
					application_id: APP_ID,
					fields:'name,nation,short_name,tag,tank_id,tier,type,images.big_icon,images.small_icon',
					page_no: 1
				}
			})
            .then((response)=>{
                let candidates = _(response.data.data).map((val)=>{
                    val.name = val.short_name;
                    val.img = val.images.big_icon;
                    val.imgSplash = val.images.big_icon;
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
                        result = result && candidate.tags.includes(vmodel)
                })
                return result
            })
        },
    }
},whitelistMixin)
export default wot
