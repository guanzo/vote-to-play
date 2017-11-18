

import dota         from './dota'
import overwatch    from './overwatch'
import lol          from './lol'
import hearthstone  from './hearthstone'
import hots         from './hots'
import battlerite   from './battlerite'
import allGames     from './allGames'



export default {
    modules:{
        dota,
        overwatch,
        lol,
        hearthstone,
        hots,
        battlerite,
        allGames,
    },
    getters:{
        supportedGames(state){
            return  _.map(state,'gameName')
        },
        selectedGameModule(state,getters,rootState){
            return _.find(state, game =>{
                return game.gameName == rootState.voteCategory
            })
        },
    }
}