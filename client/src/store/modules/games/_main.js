import * as MUTATIONS from '@/store/mutations'
import * as ACTIONS from '@/store/actions'
import voteApi from '@/api/vote'

import allGames,    { NAMESPACE as NS_AG }      from './allGames'
import battlerite,  { NAMESPACE as NS_BR }      from './battlerite'
import dota,        { NAMESPACE as NS_DOTA }    from './dota'
import hearthstone, { NAMESPACE as NS_HS }      from './hearthstone'
import hots,        { NAMESPACE as NS_HOTS }    from './hots'
import lol,         { NAMESPACE as NS_LOL }     from './lol'
import overwatch,   { NAMESPACE as NS_OW }      from './overwatch'

export const mutations = {
    [MUTATIONS.SET_WHITELIST](state, whitelist){
        console.log(whitelist)
        _.each(state,game=>{
            let gameName = game.gameName;
            if(whitelist[gameName])
                game.whitelistedNames = whitelist[gameName]
            else
                game.whitelistedNames = []
        })
    }
}

export const actions = {
    [ACTIONS.SAVE_GAME_WHITELIST]( {rootState}, gameWhitelist ){
        //supported games: save as array of strings
        //all games:       save as array of objects

        let { voteCategory, names } = gameWhitelist
        if(voteCategory == NS_AG)
            gameWhitelist.names = names.map(d=>_.pick(d,'name','img'))
        else
            gameWhitelist.names = names.map(d=>d.name)
        voteApi.saveGameWhitelist({ channelId: rootState.channelId, gameWhitelist })
    },
}

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
    mutations,
    actions,
    getters
}
