/**
 * This module requires special treament.
 * Unlike all other game modules, I have to request candidates from twitch,
 * therefore there is no "filtering" of existing candidates, there is
 * only searching.
 * 
 */

import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import GameSearch from './util/gameSearch'
import whitelistMixin,{ saveArrayState, processArrays } from './util/whitelistMixin';

let modifiedMixin = _.merge({},whitelistMixin,
    {
        mutations:{
            partition(state){
                let candidates = state.searchedGames.length ? state.searchedGames : state.topGames
                state.tempWhitelist = state.whitelistedNames
                state.tempBlacklist = candidates
            },
            updateTempBlacklist(state,candidates){
                state.tempBlacklist = [...candidates]
            },
            removeUnsavedChanges(state){
                //saveArrayState(state)
                let removed = _.remove(state.tempWhitelist,a=> {
                    return !state.whitelistedNames.some(b=>b.name == a.name)
                })
                state.tempBlacklist.push(...removed)
                
                removed = _.remove(state.tempBlacklist,a=> {
                    return state.whitelistedNames.some(b=>b.name == a.name)
                })
                state.tempWhitelist.push(...removed)
                processArrays(state.tempWhitelist,state.tempBlacklist)
            }
        },
        getters:{//no-op
            whitelistedCandidates({whitelistedNames}){
                return whitelistedNames
            },//no-op
            filteredBlacklist({tempBlacklist}){
                return tempBlacklist
            }
        }
    }
)

const engine = new GameSearch();

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
            state.searchedGames = searchedGames;
        },
        
    },
    actions:{
        [ACTIONS.GET_CANDIDATES]({commit}){
            let limit = 30;
            return axios.get(`https://api.twitch.tv/kraken/games/top?limit=${limit}`,{
                headers:{
                            'Client-ID':EXTENSION_CLIENT_ID,
                        }
                })
                .then(res=>{
                    let topGames = res.data.top.map(d=>{
                        let game = d.game
                        setImage(game)
                        return game
                    })
                    commit(MUTATIONS.SET_TOP_TWITCH_GAMES, topGames)
                    engine.addTopGames(topGames)
                })
        },
        async searchGames({commit},query){
            let results = await engine.searchGames(query)
            results.forEach(setImage)
            commit(MUTATIONS.SET_SEARCHED_GAMES, results)
        }
        
    },
    getters:{
        candidates(state, {gameQuery}){
            return gameQuery.length ? state.searchedGames : state.topGames
        },
        gameQuery(state){
            return state.filters[0].vmodel
        },
        filteredCandidates(state,getters){
            return getters.candidates
        },
    }
},modifiedMixin)

//twitch allows you to give custom dimensions
function setImage(d){
    d.img = d.box.template.replace('{width}',BOX_ART_WIDTH).replace('{height}',BOX_ART_HEIGHT)
    return d
}

export default allGames

