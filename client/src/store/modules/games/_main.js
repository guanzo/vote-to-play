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
import wot,   		{ NAMESPACE as NS_WOT }     from './wot'

export const mutations = {
    [MUTATIONS.SET_WHITELIST](state, whitelist){
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
		let { voteCategory, names } = gameWhitelist
		let props = ['id','name']
		//i dont want to fetch img for each game dynamically, just save the img link
		if(voteCategory === NS_AG)
			props.push('img')
		
		gameWhitelist.names = names.map(d=>_.pick(d,props))
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

//don't add a "state" property,
//since modules are added to the state automatically,
//i need the state to ONLY be games and nothing else.
export default {
    modules:{
        [NS_AG]:    allGames,
        [NS_BR]:    battlerite,
        [NS_DOTA]:  dota,
        [NS_HS]:    hearthstone,
        [NS_HOTS]:  hots,
        [NS_LOL]:   lol,
        [NS_OW]:    overwatch,
        [NS_WOT]:   wot,
    },
    mutations,
    actions,
    getters
}
