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
    }
}

export default lol
