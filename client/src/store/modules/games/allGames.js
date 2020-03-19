/**
 * This module requires special treament.
 * Unlike all other game modules, I have to request candidates from twitch,
 * therefore there is no "filtering" of existing candidates, there is
 * only searching.
 *
 */

import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import GameSearch from './util/twitchGameSearch'
import whitelistMixin,{ processArrays } from './util/whitelistMixin';
import { gameOptions, gameMixin, FILTER_MODE_NONE } from './util/gameMixin'

const engine = new GameSearch();

export const NAMESPACE = 'All Games'
export const BOX_ART_WIDTH = 72;
export const BOX_ART_HEIGHT = 100;

const modifiedWhitelistMixin = _.merge({},whitelistMixin,
    {
        mutations:{
            removeUnsavedChanges(state){
                let removed = _.remove(state.tempWhitelist,a=> {
                    return !state.whitelistedNames.some(b=>b.name === a.name)
                })
                state.tempBlacklist.push(...removed)

                removed = _.remove(state.tempBlacklist,a=> {
                    return state.whitelistedNames.some(b=>b.name === a.name)
                })
                state.tempWhitelist.push(...removed)
                processArrays(state.tempWhitelist,state.tempBlacklist, state.gameOptions)
            },
            updateTempBlacklist(state,candidates){
                state.tempBlacklist = [...candidates]
            },
        },
        actions:{
            //called on every game search, don't overwrite current tempWhitelist
            partition({commit, state, getters}){
                const partition = {
                    tempBlacklist: getters.candidates
                }
                if(!state.tempWhitelist.length)
                    partition.tempWhitelist = state.whitelistedNames
                else
                    partition.tempWhitelist = state.tempWhitelist
                commit('partition',partition)
            },
        },
        getters:{
            //no-op
            whitelistedCandidates({whitelistedNames}){
                return whitelistedNames
            },//no-op
            filteredBlacklist({tempBlacklist}){
                return tempBlacklist
            }
        }
    }
)


const allGames = _.merge({},gameMixin,modifiedWhitelistMixin,{
    namespaced: true,
    state:{
        gameName: NAMESPACE,
        candidateNomenclature: 'game',
		className: 'all-games',
		gameOptions: gameOptions({
			showNameInGrid: true,
			filterMode: FILTER_MODE_NONE
		}),
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
			topGames.forEach(c=>c.id = c._id)
            state.topGames = topGames
        },
        [MUTATIONS.SET_SEARCHED_GAMES](state,searchedGames){
			searchedGames.forEach(c=>c.id = c._id)
			state.searchedGames = searchedGames;
        },

    },
    actions:{
        [ACTIONS.GET_CANDIDATES]({commit}){
            const limit = 30;
            return axios.get(`https://api.twitch.tv/kraken/games/top?limit=${limit}`,{
                headers:{
                            'Client-ID': process.env.VUE_APP_EXTENSION_CLIENT_ID,
                        }
                })
                .then(res=>{
                    const topGames = res.data.top.map(d=>{
                        const game = d.game
                        setImage(game)
                        return game
                    })
                    commit(MUTATIONS.SET_TOP_TWITCH_GAMES, topGames)
                    engine.addTopGames(topGames)
                })
        },
        async searchGames({commit},query){
			const results = await engine.searchGames(query)
            results.forEach(setImage)
            commit(MUTATIONS.SET_SEARCHED_GAMES, results)
        }

    },
    getters:{
        candidates(state, {searchGamesQuery}){
            return searchGamesQuery.length ? state.searchedGames : state.topGames
        },
        searchGamesQuery(state){
            return state.filters[0].vmodel
        },//no filtering for allGames
        filteredCandidates(state,getters){
            return getters.candidates
        },
    }
})

//twitch allows you to give custom dimensions
function setImage(d){
    d.img = d.box.template.replace('{width}',BOX_ART_WIDTH).replace('{height}',BOX_ART_HEIGHT)
    return d
}

export default allGames
