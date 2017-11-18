<script>

import allGames from './AllGames'
import unsupported from './Unsupported'
import dota from './Dota'
import lol from './LeagueOfLegends'
import overwatch from './Overwatch'
import hearthstone from './Hearthstone'
import hots from './Hots'
import battlerite from './Battlerite'

import { ALL_GAMES } from '@/store/modules/games/allGames'

/** Dynamic component depends on twitch's name for the games */
const TWITCH_NAME_DOTA = 'Dota 2'
const TWITCH_NAME_OVERWATCH = 'Overwatch'
const TWITCH_NAME_LOL = 'League of Legends'
const TWITCH_NAME_HEARTHSTONE = 'Hearthstone'
const TWITCH_NAME_HOTS = 'Heroes of the Storm'
const TWITCH_NAME_BATTLERITE = 'Battlerite'

const gameMap = {
    [TWITCH_NAME_DOTA]: dota,
    [TWITCH_NAME_OVERWATCH]: overwatch,
    [TWITCH_NAME_LOL]: lol,
    [TWITCH_NAME_HEARTHSTONE]: hearthstone,
    [TWITCH_NAME_HOTS]: hots,
    [TWITCH_NAME_BATTLERITE]: battlerite
}

//functional component that returns the game view,
//or a notification if the game isn't supported
export default {
    functional: true,
    props:['selectedGame','voteCategory'],
    render(createElement, context){
        var { selectedGame, voteCategory } = context.props
        var component;
        if(voteCategory == ALL_GAMES)
            component = allGames
        else if(gameMap[selectedGame])
            component = gameMap[selectedGame]
        else
            component = unsupported
            
        return createElement(component)
    },
}

</script>