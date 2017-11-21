import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import { whitelistedCandidates } from './_util';

export const NAMESPACE = 'All Games'
export const BOX_ART_WIDTH = 72;
export const BOX_ART_HEIGHT = 100;

const allGames = {
    namespaced: true,
    state:{
        gameName: NAMESPACE,
        candidateNomenclature: 'game',
        className: 'all-games',
        showNameInGrid: true,
        maxVoteResults: 5,
        candidates:[],
        topGames:[],
        searchedGames:[],
        whitelistedNames:[],
    },
    mutations:{
        [MUTATIONS.SET_TOP_TWITCH_GAMES](state,{ topGames }){
            state.candidates = topGames
            state.topGames = topGames
        },
        [MUTATIONS.SET_SEARCHED_GAMES](state,{searchedGames}){
            searchedGames.forEach(setImage)
            if(searchedGames.length)
                state.candidates = searchedGames
            else
                state.candidates = state.topGames
        },
        
    },
    actions:{
        [ACTIONS.GET_TOP_TWITCH_GAMES]({commit}){
            let limit = 30;
            return axios.get(`https://api.twitch.tv/kraken/games/top?limit=${limit}`,{
                headers:{
                            'Client-ID':EXTENSION_CLIENT_ID,
                        }
                })
                .then(res=>{
                    let topGames = res.data.top.map(d=>d.game)
                    topGames.forEach(setImage)
                    commit(MUTATIONS.SET_TOP_TWITCH_GAMES, { topGames })
                })
        },
        
    },
    getters:{
        filteredCandidates(state){
            return state.candidates
        },
        whitelistedCandidates
    }
}
//twitch allows you to give custom dimensions
function setImage(d){
    d.img = d.box.template.replace('{width}',BOX_ART_WIDTH).replace('{height}',BOX_ART_HEIGHT)
}

export default allGames