<script>

import allGames     from './AllGames'
import battlerite   from './Battlerite'
import dota         from './Dota'
import hearthstone  from './Hearthstone'
import hots         from './Hots'
import lol          from './LeagueOfLegends'
import overwatch    from './Overwatch'
import unsupported  from './Unsupported'

import { NAMESPACE as ALL_GAMES }   from '@/store/modules/games/allGames'
import { NAMESPACE as NS_BR }       from '@/store/modules/games/battlerite'
import { NAMESPACE as NS_DOTA }     from '@/store/modules/games/dota'
import { NAMESPACE as NS_HS }       from '@/store/modules/games/hearthstone'
import { NAMESPACE as NS_HOTS }     from '@/store/modules/games/hots'
import { NAMESPACE as NS_LOL }      from '@/store/modules/games/lol'
import { NAMESPACE as NS_OW }       from '@/store/modules/games/overwatch'

const componentMap = {
    [NS_BR]:    battlerite,
    [NS_DOTA]:  dota,
    [NS_HS]:    hearthstone,
    [NS_HOTS]:  hots,
    [NS_LOL]:   lol,
    [NS_OW]:    overwatch,
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
        else if(componentMap[selectedGame])
            component = componentMap[selectedGame]
        else
            component = unsupported
            
        return createElement(component)
    },
}

</script>