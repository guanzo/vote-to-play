<template>
    <div class="viewer">
        <div class="viewer-header">
            <test-util v-if="IS_DEVELOPMENT"></test-util>
            <transition name="fade">
                <div v-if="showExpandTip" class="expand-tip overlay-background">
                    {{ streamerName }} wants your vote! <span v-if="!isExpanded">Click the icon to proceed.</span>
                </div>
            </transition>
            <img @click="toggleUI" class="logo" src="~@/assets/images/logos/dotavoter-logo-red-sm.png" alt="logo">
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
import { SET_STREAMER_NAME} from '@/store/mutations'
import TestUtil from './test/TestUtil'
import _ from 'lodash'
import dota from './dota/Dota'
import lol from './lol/LeagueOfLegends'
import overwatch from './overwatch/Overwatch'
import hearthstone from './hearthstone/Hearthstone'
import hots from './hots/Hots'

/** Dynamic component depends on twitch's name for the games */
const TWITCH_NAME_DOTA = 'Dota 2'
const TWITCH_NAME_OVERWATCH = 'Overwatch'
const TWITCH_NAME_LOL = 'League of Legends'
const TWITCH_NAME_HEARTHSTONE = 'Hearthstone'
const TWITCH_NAME_HOTS = 'Heroes of the Storm'

export default {
    name: 'viewer',
    data(){
        return {
            isExpanded: false,
            showExpandTip: false,
        }
    },
    computed:{
        ...mapState(['selectedGame','votes','streamerName','TESTING']),
        ...mapGetters(['hasSubmittedVote']),
        IS_DEVELOPMENT(){ return this.TESTING.IS_DEVELOPMENT },
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
        [TWITCH_NAME_DOTA]: dota,
        [TWITCH_NAME_OVERWATCH]: overwatch,
        [TWITCH_NAME_LOL]: lol,
        [TWITCH_NAME_HEARTHSTONE]: hearthstone,
        [TWITCH_NAME_HOTS]: hots,
        TestUtil
    }
}
</script>



<style lang="scss" scoped>

//don't cover twitch ui on top and bottom
$twitch-overlay-ui-size: 40px;
$header-element-size: 35px;

.viewer{
    padding: $twitch-overlay-ui-size 15px;
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
            opacity: 0.75;
            transition: 0.35s;
            -webkit-backface-visibility: hidden;
            &:hover{
                opacity: 1;
            }
        }
        .toggle-vote-simulation{
            background: grey;
            padding: 0px 5px;
            margin-right: 15px;
        }
    }
    .viewer-body{
        font-family: 'Cinzel', serif;
        color: #eee;
        flex: 1;
        display: flex;
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
