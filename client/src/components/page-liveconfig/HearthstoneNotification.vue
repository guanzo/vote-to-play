<template>
<transition name="fade">
    <div v-if="showNotification" class="notification is-info">
        <button @click="onClose" class="delete" />
        <strong>Playing Hearthstone?</strong>
        <div>You can add custom decks in the extension settings.</div>
    </div>
</transition>
</template>

<script>

import { NAMESPACE as HEARTHSTONE } from '@/store/modules/games/hearthstone'
const notifiedHearthstoneDecks = 'notifiedHearthstoneDecks'

export default {
    name:'hearthstone-notification',
    data(){
        return {
            shouldNotify: false
        }
    },
    computed:{
        ...Vuex.mapState(['selectedGame']),
        ...Vuex.mapGetters(HEARTHSTONE,['hasCustomDecks']),
        showNotification(){
            return this.shouldNotify && !this.hasCustomDecks
        }
    },
    watch:{
        selectedGame(){
            if(this.selectedGame == HEARTHSTONE)
                this.notify()
            else
                this.shouldNotify = false;
        },//if user adds custom decks without ever seeing this notification
          //no need to show
        hasCustomDecks(){
            if(this.hasCustomDecks)
                this.onClose();
        }
    },
    methods:{
        notify(){
            var hasInformed = localStorage.getItem(notifiedHearthstoneDecks)
            if(hasInformed)
                return;
            this.shouldNotify = true;
            
        },
        onClose(){
            this.shouldNotify = false;
            localStorage.setItem(notifiedHearthstoneDecks,true)
        }
    },
}

</script>

