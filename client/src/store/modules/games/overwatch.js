import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import whitelistMixin from './util/whitelistMixin';
import gameOptions from './util/gameOptions'


import heroes from '@/assets/json/overwatch_heroes'

var candidates = _(heroes).map(candidate=>{
    candidate.img = candidate.avatar
    candidate.imgSplash = cl.url("overwatch/splash/" + candidate.name.replace(/ /g,'') + `_splash.jpg`);
    return candidate
}).sortBy('name').value()

let roles = _(candidates).map(d=>d.type).uniq().sort().value()

export const NAMESPACE = 'Overwatch'

const ow = _.merge({
    namespaced: true,
    state: { 
        gameName: NAMESPACE,
        candidateNomenclature: 'hero',
        className: 'overwatch',
		gameOptions: gameOptions({ maxVoteResults: 3 }),
        candidates,
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
                    'Role',
                    ...roles
                ]
            }
        ]
    },
    mutations:{//ensure it conforms to game module expected properties
        [MUTATIONS.SET_CANDIDATES](){},
        
    },
    actions:{
        [ACTIONS.GET_CANDIDATES](){}
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
                        result = result && candidate.type === vmodel
                })
                return result
            })
        },
    }
},whitelistMixin)

export default ow
