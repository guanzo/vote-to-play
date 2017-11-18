import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'

export const NS_LOL = 'lol'

const IMG_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/'
const IMG_SPLASH_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/'
const lol = {
    namespaced: true,
    state: { 
        gameName: 'League of Legends',
        candidateNomenclature: 'champion',
        maxResults: 5,
        candidates: []
    },
    mutations:{
        [MUTATIONS.SET_CANDIDATES](state, { candidates }){
            state.candidates = candidates
        }
    },
    actions:{
        [ACTIONS.GET_CANDIDATES]({commit}){
            axios.get('https://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json')
            .then((response)=>{
                
                let candidates = _.map(response.data.data,(val)=>{
                    val.name = val.id;
                    val.img = IMG_BASE_URL + val.image.full;
                    //riot provides splash art per skin, thats what the _0 is for.
                    //maybe in the future, cycle thru skins.
                    val.imgSplash = IMG_SPLASH_BASE_URL + val.name + '_0.jpg'
                    return val
                })
                commit(MUTATIONS.SET_CANDIDATES,{ candidates })
            })
        }
    }
}

export default lol
