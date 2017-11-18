import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'

export const NAMESPACE = 'League of Legends'

const IMG_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/'
const IMG_SPLASH_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/'
const lol = {
    namespaced: true,
    state: { 
        gameName: NAMESPACE,
        candidateNomenclature: 'champion',
        maxVoteResults: 5,
        candidates: [],
        className: 'league-of-legends',
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
            let roles = _(candidates).map(d=>d.tags).flatMap().uniq().sort().value()
            state.filters[1].options.push(...roles)
        }
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
                        result = result && candidate.tags.includes(vmodel)
                })
                return result
            })
        }
    }
}

export default lol
