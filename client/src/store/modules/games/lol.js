import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import whitelistMixin from './util/whitelistMixin';
import { gameOptions, gameMixin } from './util/gameMixin'


export const NAMESPACE = 'League of Legends'

const API_BASE_URL 			= 'https://ddragon.leagueoflegends.com/'
const CDN_BASE_URL 			= API_BASE_URL + 'cdn/'
const VERSION_URL 			= API_BASE_URL + 'realms/na.json'
const IMG_SPLASH_BASE_URL 	= CDN_BASE_URL + 'img/champion/splash/'

function getChampionData(championApiVersion){
	return CDN_BASE_URL+`${championApiVersion}/data/en_US/champion.json`
}

function getProfileImageUrl(iconApiVersion, imageName){
	return CDN_BASE_URL+`${iconApiVersion}/img/champion/`+imageName;
}

//riot provides splash art per skin, thats what the _0 is for.
//maybe in the future, cycle thru skins.
function getSplashImageUrl(imageName){
	return IMG_SPLASH_BASE_URL + imageName + '_0.jpg'
}

const lol = _.merge({},gameMixin,whitelistMixin,{
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
                options:['Role']
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
        async [ACTIONS.GET_CANDIDATES]({commit}){
			let result = await axios.get(VERSION_URL)
			let { champion: championVersion, profileicon: iconVersion } = result.data.n

            return axios.get(getChampionData(championVersion))
            .then((response)=>{
                let candidates = _(response.data.data).map((val)=>{
                    val.name = val.id;
					val.img = getProfileImageUrl(iconVersion, val.image.full)
					val.imgSplash = getSplashImageUrl(val.name)
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
                        return candidate.tags.includes(vmodel)
                })
            })
        },
    }
})
export default lol
