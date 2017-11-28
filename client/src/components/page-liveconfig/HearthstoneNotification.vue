<template>
    <div v-if="informHearthstone" class="notification is-info">
        <button @click="onClose" class="delete"></button>
        <strong>Playing Hearthstone?</strong>
        <div>You can add custom decks in the extension settings.</div>
    </div>
</template>

<script>

import { NAMESPACE as HEARTHSTONE } from '@/store/modules/games/hearthstone'
const notifiedHearthstoneDecks = 'notifiedHearthstoneDecks'

export default {
    name:'hearthstone-notification',
    data(){
        return {
            showNotification: false
        }
    },
    computed:{
        ...Vuex.mapState(['selectedGame']),
        ...Vuex.mapGetters(HEARTHSTONE,['hasCustomDecks']),
        informHearthstone(){
            return this.showNotification && !this.hasCustomDecks
        }
    },
    watch:{
        selectedGame(){
            if(this.selectedGame == HEARTHSTONE)
                this.notify()
            else
                this.showNotification = false;
        }
    },
    methods:{
        notify(){
            var hasInformed = localStorage.getItem(notifiedHearthstoneDecks)
            if(hasInformed)
                return;
            this.showNotification = true;
            
        },
        onClose(){
            this.showNotification = false;
            localStorage.setItem(notifiedHearthstoneDecks,true)
        }
    },
}

</script>

