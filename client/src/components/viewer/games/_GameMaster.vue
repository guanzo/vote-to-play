<script>

import allGames     from './AllGames'
import game         from './Game'
import unsupported  from './Unsupported'
import store        from '@/store'
import { NAMESPACE as ALL_GAMES }   from '@/store/modules/games/allGames'



var test = {
    render(h){
        return <div>TEST TEST TEST</div>
    }
}

//functional component that returns the game view,
//or a notification if the game isn't supported
export default {
    functional: true,
    props:['voteCategory'],
    render(createElement, context){
        var { voteCategory } = context.props
        let supportedGames = store.getters.supportedGames
        var component;
        if(voteCategory == ALL_GAMES)
            component = allGames
        else if(supportedGames.includes(voteCategory))
            component = game
        else
            component = unsupported
            
        return createElement(component,{
            props:{
                componentTest: test
            }
        })
    },
}

</script>