<template>
    <div class="viewer">
        <div class="viewer-header">
            <test-util />
            <transition name="fade">
                <div v-if="showExpandTip" class="expand-tip overlay-background">
                    {{ channelName }} wants your vote! <span v-if="!isExpanded">Click the icon to proceed.</span>
                </div>
            </transition>
            <img @click="toggleUI" :class="{reveal: showLogo}" class="logo" :src="logoUrl" alt="logo">
        </div>
        <transition name="fade-vertical">
            <div v-show="isExpanded" class="viewer-body">
                <game-master 
                    v-if="voteCategory"  
                    :injectedComponent="voter" 
                    :voteCategory="voteCategory"
                 />
            </div>
        </transition>
    </div>
</template>

<script>


import TestUtil from './testgui/TestUtil'
import GameMaster from '@/components/game/_GameMaster'
import voter from '@/components/page-viewer/voter/Voter'

export default {
    name: 'viewer',
    data(){
        return {
            isExpanded: false,
            showExpandTip: false,
            logoUrl: require("@/assets/images/logos/dotavoter-logo-red-sm.png"),
            voter
        }
    },
    computed:{
        ...Vuex.mapState(['selectedGame','voteCategory','currentVote','channelName','TESTING']),
        ...Vuex.mapGetters(['hasSubmittedVote']),
        showLogo(){
            return this.isExpanded || this.showExpandTip
        }
    },
    watch:{
        //show tip if votes are reset, user may or may not have voted.
        'currentVote.votes'(){
            if(this.currentVote.votes.length == 0)
                this.showExpandTip = true;
        },
        hasSubmittedVote(){
            if(this.hasSubmittedVote)
                this.showExpandTip = false;
        }
    },
    methods:{
        toggleUI(){
            this.isExpanded = !this.isExpanded
            this.showExpandTip = false;
        }
    },
    components:{
        GameMaster,
        TestUtil
    }
}
</script>

<style lang="scss">

#app{
    .logo {
        opacity: 0;
    }
    &:hover .logo, 
    .logo.reveal{
        opacity: 1;
    }
}

</style>

<style lang="scss">

//don't cover twitch ui on top and bottom
$twitch-overlay-top-height: 100px;
$twitch-overlay-bot-height: 80px;
$header-element-size: 35px;

.viewer{
    padding: $twitch-overlay-top-height 15px $twitch-overlay-bot-height 15px;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    .viewer-header{
        height: $header-element-size;
        min-height: $header-element-size;
        margin-bottom: 15px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .logo{
            width: $header-element-size;
            height: $header-element-size;
            cursor: pointer;
            transition: 0.35s;
            -webkit-backface-visibility: hidden;
        }
        .toggle-vote-simulation{
            background: grey;
            padding: 0px 5px;
            margin-right: 15px;
        }
    }
    .viewer-body{
        flex: 1;
        display: flex;
        justify-content: flex-end;
        overflow: hidden;//firefox fix//firefox fix
        > * {
            flex: 1;
        }
    }
    .expand-tip {
        height: $header-element-size;
        padding: 5px 7.5px;
        margin-right: 15px;
    }
    
    .overlay-background {
        background: rgba(0,0,0,0.85);
    }
    
    ::-webkit-scrollbar-track
    {
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 10px;
        background-color: rgba(0,0,0,0.75);
    }

    ::-webkit-scrollbar
    {
        width: 8px;
        height: 8px;
        background-color: rgba(0,0,0,0.75);
    }

    ::-webkit-scrollbar-thumb
    {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: #555;
    }
}



</style>
