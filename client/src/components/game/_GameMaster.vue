<script>

import store from '@/store'
import game from './Game'
import unsupported from './Unsupported'
import nogame from './NoGame'

const { NO_GAME } = require('@shared/constants')

//functional component that returns the game view,
//and injects the "injectedComponent" prop
//which is either the voter or whitelist component
export default {
    functional: true,
    render(createElement, context){
        const { voteCategory, injectedComponent } = context.props
        const supportedGames = store.getters.supportedGames
        let component

        if(supportedGames.includes(voteCategory)) {
            component = game
        } else if (voteCategory === NO_GAME) {
            component = nogame
        } else {
            component = unsupported
        }

        return createElement(component, {
            props:{
                injectedComponent,
                voteCategory
            }
        })
    },
}

</script>
