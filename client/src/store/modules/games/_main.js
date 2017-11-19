import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'

import allGames,    { NAMESPACE as NS_AG }      from './allGames'
import battlerite,  { NAMESPACE as NS_BR }      from './battlerite'
import dota,        { NAMESPACE as NS_DOTA }    from './dota'
import hearthstone, { NAMESPACE as NS_HS }      from './hearthstone'
import hots,        { NAMESPACE as NS_HOTS }    from './hots'
import lol,         { NAMESPACE as NS_LOL }     from './lol'
import overwatch,   { NAMESPACE as NS_OW }      from './overwatch'

export const getters = {
    supportedGames(state){
        return  _.map(state,'gameName')
    },
    selectedGameModule(state,getters,rootState){
        return _.find(state, game =>{
            return game.gameName == rootState.voteCategory
        })
    },
    gameModuleByName: state => gameName => {
        return _.find(state,game=>game.gameName == gameName)
    }
}

export default {
    modules:{
        [NS_AG]:    allGames,
        [NS_BR]:    battlerite,
        [NS_DOTA]:  dota,
        [NS_HS]:    hearthstone,
        [NS_HOTS]:  hots,
        [NS_LOL]:   lol,
        [NS_OW]:    overwatch,
    },
    getters
}

/**
 * Ghetto interface
 * Used for unit testing.
 * Each supported game (except for ALL_GAMES) 
 * should at least contain these store properties
 */
export function gameModuleRequiredProperties(){
    return {
        namespaced: "boolean",
        state:{
            gameName: "string",
            maxVoteResults: "number",
            candidates: [],
            className: "string",
            filters: [],
        },
        mutations:{
            [MUTATIONS.SET_CANDIDATES]: "function"
        },
        actions:{
            [ACTIONS.GET_CANDIDATES]: "function"
        },
        getters:{
            filteredCandidates: "function"
        }
    }
}