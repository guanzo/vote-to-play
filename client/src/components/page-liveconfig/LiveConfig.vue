<template>
<div class="live-config">
    <tabs>
        <tab name="Settings">
            <settings></settings>
        </tab>
        <tab name="Vote">
            <vote-info></vote-info>
            <vote-results></vote-results>
        </tab>
    </tabs>
    <div v-if="informHearthstone" class="notification is-info">
        <button @click="onClose" class="delete"></button>
        <strong>Playing Hearthstone?</strong>
        <div>You can add custom decks in the extension settings.</div>
    </div>
</div>
</template>

<script>
import settings from './Settings'
import voteInfo from './VoteInfo'
import voteResults from '@/components/voteresults/VoteResults'
import tabs from '@/components/util/tabs/Tabs'
import tab from '@/components/util/tabs/Tab'

import { NAMESPACE as HEARTHSTONE } from '@/store/modules/games/hearthstone'
const informedHearthstoneCustomization = 'informedHearthstoneCustomization'

export default {
    name: 'live-config',
    data(){
        return {
            informHearthstone: false
        }
    },
    computed:{
        ...Vuex.mapState(['selectedGame']),
    },
    watch:{
        selectedGame(){
            if(this.selectedGame == HEARTHSTONE)
                this.informHearthstoneCustomization()
        }
    },
    methods:{
        informHearthstoneCustomization(){
            var hasInformed = localStorage.getItem(informedHearthstoneCustomization)
            console.log(hasInformed)
            if(hasInformed)
                return;
            this.informHearthstone = true;
            
        },
        onClose(){
            this.informHearthstone = false;
            localStorage.setItem(informedHearthstoneCustomization,true)
        }
    },
    components:{
        settings,
        voteInfo,
        voteResults,
        tabs,
        tab
    }
}
</script>


<style lang="scss" scoped>

.live-config{
    padding: 5px;
    color: #333;
    height: 100%;
    position: relative;
    /deep/ .tabs{
        margin-bottom: 1rem;
    }
    .notification{
        position: absolute;
        bottom: 0;
        left: 0;    
    }
}

</style>
