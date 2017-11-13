<template>
    <div class="viewer">
        <div class="viewer-header">
            <test-util></test-util>
            <transition name="fade">
                <div v-if="showExpandTip" class="expand-tip overlay-background">
                    {{ channelName }} wants your vote! <span v-if="!isExpanded">Click the icon to proceed.</span>
                </div>
            </transition>
            <img @click="toggleUI" :class="{reveal: showLogo}" class="logo" :src="logoUrl" alt="logo">
        </div>
        <transition name="fade-vertical">
            <div v-show="isExpanded" class="viewer-body">
                <game :selectedGame="selectedGame"></game>
            </div>
        </transition>
    </div>
</template>

<script>


import TestUtil from './test/TestUtil'
import Game from './games/Game'

export default {
    name: 'viewer',
    data(){
        return {
            isExpanded: false,
            showExpandTip: false,
            logoUrl: require("@/assets/images/logos/dotavoter-logo-red-sm.png")
        }
    },
    computed:{
        ...Vuex.mapState(['selectedGame','votes','channelName','TESTING']),
        ...Vuex.mapGetters(['hasSubmittedVote']),
        showLogo(){
            return this.isExpanded || this.showExpandTip
        }
    },
    watch:{
        //show tip if votes are reset, user may or may not have voted.
        votes(){
            if(this.votes.length == 0)
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
        },
    },
    components:{
        Game,
        TestUtil,
    }
}
</script>

<style lang="scss">

#app{
    .logo {
        opacity: 0;
    }
    &:hover .logo, .logo.reveal{
        opacity: 1;
    }
}

</style>

<style lang="scss" scoped>

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
        color: #eee;
        flex: 1;
        display: flex;
        justify-content: flex-end;
        > * {
            display: flex;
            align-items: flex-start;
            justify-content: flex-end;
            width: 100%;
        }
    }
    .expand-tip {
        height: $header-element-size;
        padding: 5px 7.5px;
        margin-right: 15px;
    }
}



</style>
