<template>
    <div class="viewer">
        <div class="viewer-header">
            <div @click="toggleVoteSimulation" class="toggle-vote-simulation">
                <input type="checkbox">
            </div>
            <transition name="fade">
                <div v-if="showExpandTip" class="expand-tip overlay-background">
                    {{ streamerName }} wants your vote! <span v-if="!isExpanded">Click the icon to proceed.</span>
                </div>
            </transition>
            <img @click="toggleUI" class="logo" src="~@/assets/images/dotavoter-logo-red-sm.png" alt="logo">
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
import { SET_STREAMER_NAME, TOGGLE_VOTE_SIMULATION } from '@/store/mutations'
import _ from 'lodash'
import dota from './dota/Dota'
import lol from './lol/LeagueOfLegends'
import overwatch from './overwatch/Overwatch'
import hearthstone from './hearthstone/Hearthstone'

/** Dynamic component depends on twitch's name for the games */
const TWITCH_NAME_DOTA = 'Dota 2'
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
        ...mapState(['selectedGame','votes','streamerName','TESTING']),
        isSimulating(){ return this.TESTING.isSimulating },
        userSubmittedVote(){
            return this.$store.getters.userSubmittedVote
        },
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
        toggleUI(){
            this.isExpanded = !this.isExpanded
            this.showExpandTip = false;
        },
        toggleVoteSimulation(){
            this.$store.commit(TOGGLE_VOTE_SIMULATION)
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
        height: $header-element-size;
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
        .toggle-vote-simulation{
            width: $header-element-size;
            height: $header-element-size;
            background: grey;
            margin-right: 15px;
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
