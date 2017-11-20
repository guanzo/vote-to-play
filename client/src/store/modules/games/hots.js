


import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'


export const NAMESPACE = 'Heroes of the Storm'

const IMG_BASE_URL = 'https://d1i1jxrdh2kvwy.cloudfront.net/Images/Heroes/Portraits/'

const hots = {
    namespaced: true,
    state: { 
        gameName: NAMESPACE,
        candidateNomenclature: 'hero',
        maxVoteResults: 5,
        candidates: [],
        whitelist:[],
        className: 'heroes-of-the-storm',
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
                vmodel:'Group',
                options:[
                    'Group'
                ]
            },
            {
                id:'role2',
                type: 'select',
                vmodel:'Subgroup',
                options:[
                    'Subgroup'
                ]
            }
        ]
    },
    mutations:{
        [MUTATIONS.SET_CANDIDATES](state, { candidates }){
            state.candidates = candidates
            let roles = _(candidates).map(d=>d.Group).uniq().sort().value()
            state.filters[1].options.push(...roles)
            let roles2 = _(candidates).map(d=>d.SubGroup).uniq().sort().value()
            state.filters[2].options.push(...roles2)
        },
        
    },
    actions:{
        [ACTIONS.GET_CANDIDATES]({commit}){
            return axios.get('https://api.hotslogs.com/Public/Data/Heroes')
            .then((response)=>{
                let candidates = _(response.data).map((val)=>{
                    val.name = val.PrimaryName;
                    val.img = IMG_BASE_URL + val.ImageURL + '.png';
                    val.imgSplash = cl.url("hots/splash/" + val.ImageURL + `_splash.jpg`);
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
                        result = result && candidate.Group == vmodel
                    else if(id == 'role2' && vmodel !== options[0])
                        result = result && candidate.SubGroup == vmodel
                })
                return result
            })
        }
    }
}




export default hots
