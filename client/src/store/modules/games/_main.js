import { SET_WHITELIST } from '@/store/mutations'

import allGames, { NAMESPACE as NS_AG } from './allGames'
import battlerite, { NAMESPACE as NS_BR } from './battlerite'
import dota, { NAMESPACE as NS_DOTA } from './dota'
import hearthstone, { NAMESPACE as NS_HS } from './hearthstone'
import hots, { NAMESPACE as NS_HOTS } from './hots'
import lol, { NAMESPACE as NS_LOL } from './lol'
import overwatch, { NAMESPACE as NS_OW } from './overwatch'
import wot, { NAMESPACE as NS_WOT } from './wot'
import wow, { NAMESPACE as NS_WOW } from './wow'
import apexLegends, { NAMESPACE as NS_APEX } from './apexLegends'

export const mutations = {
    [SET_WHITELIST] (state, whitelist) {
        _.each(state, game => {
            const gameName = game.gameName
            if (whitelist[gameName]) { game.whitelistedNames = whitelist[gameName] } else { game.whitelistedNames = [] }
        })
    }
}

export const getters = {
    supportedGames (state) {
        return _.map(state, 'gameName').sort((a, b) => a.localeCompare(b))
    },
    selectedGameModule (state, getters, rootState) {
        return _.find(state, game => {
            return game.gameName === rootState.voteCategory
        })
    },
    // used when streamer is editing whitelist, and is able to manually select current game
    // therefore i need to retrieve module by name, instead of using selectedGameModule
    gameModuleByName: state => gameName => {
        return _.find(state, game => game.gameName === gameName)
    }
}

// Don't add a "state" property,
// Since modules are added to the state automatically,
// I need the state to ONLY be games so I can iterate
export default {
    modules: {
        [NS_AG]: allGames,
        [NS_BR]: battlerite,
        [NS_DOTA]: dota,
        [NS_HS]: hearthstone,
        [NS_HOTS]: hots,
        [NS_LOL]: lol,
        [NS_OW]: overwatch,
        [NS_WOT]: wot,
        [NS_WOW]: wow,
        [NS_APEX]: apexLegends
    },
    mutations,
    getters
}
