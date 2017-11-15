import axios from 'axios'

import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'

export const NS_ALLGAMES = 'allGames'

export const ALL_GAMES = 'All Games'

const allGames = {
    namespaced: true,
    state:{
        gameName: ALL_GAMES,
        topGames:[]
    },
    mutations:{
        [MUTATIONS.SET_TOP_TWITCH_GAMES](state,payload){
            state.topGames = payload.topGames
        }
    },
    actions:{
        [ACTIONS.GET_TOP_TWITCH_GAMES]({commit}){
            axios.get('https://api.twitch.tv/kraken/games/top',{
                headers:{
                            'Client-ID':EXTENSION_CLIENT_ID,
                        }
                })
                .then(res=>{
                    console.log(res)
                    let topGames = res.data.top
                    commit(MUTATIONS.SET_TOP_TWITCH_GAMES, { topGames })
                })
        }
    },
    getters:{

    }
}

export default allGames