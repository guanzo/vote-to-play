<template>
    <div class="viewer">
        <div class="viewer-header">
            <transition name="fade">
                <div v-if="showExpandTip" class="expand-tip overlay-background">
                    The broadcaster wants your vote! <span v-if="!isExpanded">Click the icon to proceed.</span>
                </div>
            </transition>
            <img @click="showUI" class="logo" src="~@/assets/images/dotavoter-logo-red-sm.png" alt="logo">
        </div>
        <transition name="fade-vertical">
            <div v-show="isExpanded" class="viewer-body">
                <component :is="selectedGame"></component>
            </div>
        </transition>
    </div>
</template>

<script>

import axios from 'axios'
import { mapState, mapGetters } from 'vuex'
import _ from 'lodash'
import dota from './dota/Dota'
import lol from './lol/LeagueOfLegends'
import overwatch from './overwatch/Overwatch'
import hearthstone from './hearthstone/Hearthstone'

/** Dynamic component depends on twitch's name for the games */
const TWITCH_NAME_DOTA = 'Dota 2';
const TWITCH_NAME_OVERWATCH = 'Overwatch'
const TWITCH_NAME_LOL = 'League of Legends'
const TWITCH_NAME_HEARTHSTONE = 'Hearthstone'

export default {
    name: 'viewer',
    data(){
        return {
            isExpanded: false,
            showExpandTip: false,
        }
    },
    computed:{
        ...mapState(['selectedGame','votes','userSubmittedVote']),
    },
    created(){
        //console.log(this)
    },
    watch:{
        votes(){
            if(this.votes.length == 0)
                this.showExpandTip = true;
        },
        userSubmittedVote(){
            if(this.userSubmittedVote)
                this.showExpandTip = false;
        }
    },
    methods:{
        showUI(){
            this.isExpanded = !this.isExpanded
            this.showExpandTip = false;
        }
    },
    components:{
        [TWITCH_NAME_DOTA]: dota,
        [TWITCH_NAME_OVERWATCH]: overwatch,
        [TWITCH_NAME_LOL]: lol,
        [TWITCH_NAME_HEARTHSTONE]: hearthstone
    }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

$header-element-size: 35px;

.viewer{
    padding: 15px;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    .viewer-header{
        margin-top: 40px;
        margin-bottom: 15px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .logo{
            width: $header-element-size;
            height: $header-element-size;
            cursor: pointer;
            opacity: 0.75;
            transition: 0.35s;
            -webkit-backface-visibility: hidden;
            &:hover{
                opacity: 1;
            }
        }
    }
    .viewer-body{
        flex: 1;
        display: flex;
    }
    .expand-tip {
        height: $header-element-size;
        padding: 5px 7.5px;
        margin-right: 15px;
    }
}



</style>
