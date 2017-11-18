import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'

export const NAMESPACE = 'All Games'

export const BOX_ART_WIDTH = 72;
export const BOX_ART_HEIGHT = 100;

const allGames = {
    namespaced: true,
    state:{
        gameName: NAMESPACE,
        topGames:[],
        searchedGames:[]
    },
    mutations:{
        [MUTATIONS.SET_TOP_TWITCH_GAMES](state,payload){
            state.topGames = payload.topGames
        },
        [MUTATIONS.SET_SEARCHED_GAMES](state,{searchedGames}){
            searchedGames.forEach(setImage)
            state.searchedGames = searchedGames
        }
    },
    actions:{
        [ACTIONS.GET_TOP_TWITCH_GAMES]({commit}){
            let limit = 30;
            axios.get(`https://api.twitch.tv/kraken/games/top?limit=${limit}`,{
                headers:{
                            'Client-ID':EXTENSION_CLIENT_ID,
                        }
                })
                .then(res=>{
                    let topGames = res.data.top.map(d=>d.game)
                    topGames.forEach(setImage)
                    commit(MUTATIONS.SET_TOP_TWITCH_GAMES, { topGames })
                })
        }
    },
    getters:{
        test(state){
            return state
        }
    }
}
//twitch allows you to give custom dimensions
function setImage(d){
    d.img = d.box.template.replace('{width}',BOX_ART_WIDTH).replace('{height}',BOX_ART_HEIGHT)
}

export default allGames