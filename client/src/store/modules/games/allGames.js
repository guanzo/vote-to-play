import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'

import whitelistMixin from './_whitelistMixin';

let modifiedMixin = _.merge({},whitelistMixin,
    {
        mutations:{
            partition(state){
                let candidates = state.searchedGames.length ? state.searchedGames : state.topGames
                state.tempWhitelistedCandidates = state.whitelistedNames
                state.tempBlacklistedCandidates = candidates
            },
            updateTempBlacklist(state,candidates){
                console.log(candidates)
                state.tempBlacklistedCandidates = [...candidates]
            },
        },
        getters:{
            whitelistedCandidates({whitelistedNames}){
                return whitelistedNames
            },
            filteredBlacklist({tempBlacklistedCandidates}){
                return tempBlacklistedCandidates
            }
        }
    }
)
/* 
import GameSearch from '@/components/page-viewer/games/AllGamesSearch2'

const engine = new GameSearch();
console.log(engine) */

export const NAMESPACE = 'All Games'
export const BOX_ART_WIDTH = 72;
export const BOX_ART_HEIGHT = 100;

const allGames = _.merge({
    namespaced: true,
    state:{
        gameName: NAMESPACE,
        candidateNomenclature: 'game',
        className: 'all-games',
        showNameInGrid: true,
        maxVoteResults: 5,
        topGames:[],
        searchedGames:[],
        whitelistedNames:[],
        tempWhitelistedCandidates:[],
        tempBlacklistedCandidates:[],
        filters:[
            {
                id:'name',
                type: 'text',
                vmodel: '',
                placeholder: 'Search games'
            }
        ]
    },
    mutations:{
        [MUTATIONS.SET_TOP_TWITCH_GAMES](state, topGames){
            state.topGames = topGames
        },
        [MUTATIONS.SET_SEARCHED_GAMES](state,searchedGames){
            searchedGames.forEach(setImage)
            state.searchedGames = searchedGames;
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
                    commit(MUTATIONS.SET_TOP_TWITCH_GAMES, topGames)
                })
        },
        
    },
    getters:{
        candidates(state){
            return state.filters[0].vmodel.length ? state.searchedGames : state.topGames
        },
        filteredCandidates(state){
            return state.candidates
        },
    }
},modifiedMixin)
//twitch allows you to give custom dimensions
function setImage(d){
    d.img = d.box.template.replace('{width}',BOX_ART_WIDTH).replace('{height}',BOX_ART_HEIGHT)
}

export default allGames

