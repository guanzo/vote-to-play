<script>

import game         from './Game'
import unsupported  from './Unsupported'
import store        from '@/store'

//functional component that returns the game view,
//and injects the "injectedComponent" prop
//which is either the voter or whitelist component
export default {
    functional: true,
    render(createElement, context){
        const { voteCategory, injectedComponent } = context.props
        const supportedGames = store.getters.supportedGames
        let component

        if(supportedGames.includes(voteCategory))
            component = game
        else
            component = unsupported

        return createElement(component, {
            props:{
                injectedComponent,
                voteCategory
            }
        })
    },
}

</script>
