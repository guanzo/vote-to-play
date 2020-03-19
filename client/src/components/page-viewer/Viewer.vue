<template>
    <div class="viewer">
        <div class="viewer-header">
            <test-util />
            <transition name="fade">
                <div v-if="notifyNewVote" class="expand-tip viewer-ui-block">
                    {{ channelName }} wants your vote! <span v-if="!isExpanded">Click the icon to proceed.</span>
                </div>
            </transition>
            <div
                class="logo viewer-ui-block"
                @click="toggleUI"
                :class="logoClass">
                <img :src="logoUrl" alt="logo">
            </div>
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
import { mapState, mapGetters } from 'vuex'

import TestUtil from './testgui/TestUtil'
import GameMaster from '@/components/game/_GameMaster'
import voter from '@/components/page-viewer/voter/Voter'

export default {
    name: 'viewer',
    data(){
        return {
            isExpanded: false,
            notifyNewVote: false,
            logoUrl: require("@/assets/images/logos/dotavoter-logo-red-sm.png"),
            voter
        }
    },
    computed:{
        ...mapState([
            'selectedGame','voteCategory','currentVote','channelName','TESTING'
        ]),
        ...mapGetters(['hasSubmittedVote']),
        showLogo(){
            return this.isExpanded || this.notifyNewVote
        },
        logoClass () {
            return {
                reveal: this.showLogo,
                pulse: this.notifyNewVote,
            }
        }
    },
    watch:{
        //show tip if votes are reset, user may or may not have voted.
        'currentVote.votes'(){
            if(this.currentVote.votes.length === 0)
                this.notifyNewVote = true
        },
        hasSubmittedVote(){
            if(this.hasSubmittedVote)
                this.notifyNewVote = false
        }
    },
    methods:{
        toggleUI(){
            this.isExpanded = !this.isExpanded
            this.notifyNewVote = false
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
$overlay-border-radius: 4px;

.viewer{
    padding: $twitch-overlay-top-height $viewer-ui-gap $twitch-overlay-bot-height $viewer-ui-gap;
    max-height: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .viewer-ui-block {
        background: rgba(0,0,0,0.85);
        border-radius: $overlay-border-radius;
    }

    .viewer-header{
        height: $header-element-size;
        min-height: $header-element-size;
        margin-bottom: $viewer-ui-gap;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .logo{
            width: $header-element-size;
            height: $header-element-size;
            cursor: pointer;
            transition: 0.35s;
            -webkit-backface-visibility: hidden;
            img {
                border-radius: $overlay-border-radius;
            }
        }
        .toggle-vote-simulation{
            background: grey;
            padding: 0px 5px;
            margin-right: $viewer-ui-gap;
        }
    }
    .viewer-body{
        flex: 1;
        display: flex;
        justify-content: flex-end;
        overflow: hidden;//firefox fix
        > * {
            flex: 1;
        }
    }
    .expand-tip {
        height: $header-element-size;
        padding: 5px 7.5px;
        margin-right: $viewer-ui-gap;
    }
    ::-webkit-scrollbar {
        width: 14px;
        height: 18px;
    }
    ::-webkit-scrollbar-thumb {
        height: 6px;
        border: 4px solid rgba(0, 0, 0, 0);
        background-clip: padding-box;
        border-radius: 8px;
        background-color: #555;
        -webkit-box-shadow: inset -1px -1px 0px rgba(0, 0, 0, 0.3), inset 1px 1px 0px rgba(0, 0, 0, 0.3);
    }
    ::-webkit-scrollbar-button {
        width: 0;
        height: 0;
        display: none;
    }
    ::-webkit-scrollbar-corner {
        background-color: transparent;
    }
}


@keyframes pulse {
    100% {
        top: -6px;
        right: -6px;
        bottom: -6px;
        left: -6px;
        opacity: 0;
    }
}
.pulse {
    position: relative;
}
.pulse:before {
    content: '';
    position: absolute;
    border: #b71c1c solid 3px;
    border-radius: $overlay-border-radius;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    animation: pulse 1s infinite;
}
</style>
