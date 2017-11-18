


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
        candidates: []
    },
    mutations:{
        [MUTATIONS.SET_CANDIDATES](state, { candidates }){
            state.candidates = candidates
        }
    },
    actions:{
        [ACTIONS.GET_CANDIDATES]({commit}){
            axios.get('https://api.hotslogs.com/Public/Data/Heroes')
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
    }
}




export default hots
