import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import whitelistMixin from './util/whitelistMixin';
import { gameOptions, gameMixin } from './util/gameMixin'


export const NAMESPACE = 'League of Legends'

const IMG_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/'
const IMG_SPLASH_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/'

const lol = _.merge({
    namespaced: true,
    state: { 
        gameName: NAMESPACE,
        candidateNomenclature: 'champion',
        className: 'league-of-legends',
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
            let roles = _(candidates).map(d=>d.tags).flatMap().uniq().sort().value()
            state.filters[1].options.push(...roles)
        },
        
    },
    actions:{
        [ACTIONS.GET_CANDIDATES]({commit}){
            return axios.get('https://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json')
            .then((response)=>{
                let candidates = _(response.data.data).map((val)=>{
                    val.name = val.id;
                    val.img = IMG_BASE_URL + val.image.full;
                    //riot provides splash art per skin, thats what the _0 is for.
                    //maybe in the future, cycle thru skins.
                    val.imgSplash = IMG_SPLASH_BASE_URL + val.name + '_0.jpg'
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
                let result = true;
                activeFilters.forEach(({id,vmodel,options})=>{
                    if(id == 'name')
                        result = result && candidate.name.toLowerCase().includes(vmodel.toLowerCase())
                    else if(id == 'role' && vmodel !== options[0])
                        result = result && candidate.tags.includes(vmodel)
                })
                return result
            })
        },
    }
},gameMixin,whitelistMixin)
export default lol
