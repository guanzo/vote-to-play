<script>

import game         from './Game'
import unsupported  from './Unsupported'
import store        from '@/store'
import { NAMESPACE as ALL_GAMES }   from '@/store/modules/games/allGames'

//functional component that returns the game view,
//and injects the "injectedComponent" prop
//which is either the voter or whitelist component
export default {
    functional: true,
    render(createElement, context){
        var { voteCategory, injectedComponent } = context.props
        let supportedGames = store.getters.supportedGames
        var component;
        
        if(supportedGames.includes(voteCategory))
            component = game
        else
            component = unsupported
            
        return createElement(component,{
            props:{
                injectedComponent,
                voteCategory
            }
        })
    },
}

</script>