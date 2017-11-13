<script>

import gameUnsupported from './GameUnsupported'
import dota from './Dota'
import lol from './LeagueOfLegends'
import overwatch from './Overwatch'
import hearthstone from './Hearthstone'
import hots from './Hots'

/** Dynamic component depends on twitch's name for the games */
const TWITCH_NAME_DOTA = 'Dota 2'
const TWITCH_NAME_OVERWATCH = 'Overwatch'
const TWITCH_NAME_LOL = 'League of Legends'
const TWITCH_NAME_HEARTHSTONE = 'Hearthstone'
const TWITCH_NAME_HOTS = 'Heroes of the Storm'

const gameMap = {
    [TWITCH_NAME_DOTA]: dota,
    [TWITCH_NAME_OVERWATCH]: overwatch,
    [TWITCH_NAME_LOL]: lol,
    [TWITCH_NAME_HEARTHSTONE]: hearthstone,
    [TWITCH_NAME_HOTS]: hots,
}

//functional component that returns the game view,
//or a notification if the game isn't supported
export default {
    functional: true,
    props:['selectedGame'],
    render(createElement, context){
        var { selectedGame } = context.props
        var gameComponent = gameMap[selectedGame]
        var component = gameComponent ? gameComponent : gameUnsupported
        return createElement(component)
    },
}

</script>