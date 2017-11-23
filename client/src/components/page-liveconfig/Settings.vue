<template>
    <div class="live-config-settings flex-center flex-column">
        <span @click="showIntro" class="icon-help-circled"></span>
        <div class="vote-category field has-text-centered m-b-10" :data-intro="introVoteCategory">
            <label class="label">Vote Category</label>
            <div class="control flex-center flex-column">
                <label v-for="voteCategory in voteCategorys" class="radio m-b-5" :key="voteCategory">
                    <input type="radio" v-model="selectedVoteCategory" :value="voteCategory"  name="vote-category">
                    {{ voteCategory }}
                </label>
            </div>
        </div>
        <div v-if="isSupportedGame" class="vote-mode field has-text-centered m-b-10" :data-intro="introVoteMode">
            <label class="label">Vote Mode</label>
            <div class="control flex-center flex-column">
                <label v-for="voteMode in voteModes" class="radio m-b-5"  :key="voteMode">
                    <input type="radio" 
                        v-model="selectedVoteMode" 
                        :value="voteMode"
                        name="vote-mode" 
                    >
                    {{ voteMode }}
                </label>
                <div v-if="showWhitelistTip" class="help is-danger">You must configure a whitelist</div>
            </div>
        </div>
        <div v-if="isSupportedGame">
            <div class="has-text-centered">
                <button @click="startVote" 
                        :class="{'is-loading':isLoading}" 
                        class="start-vote button"  
                        :data-intro="introStartVote"
                >
                    Start a vote
                </button>
            </div>
        </div>
        <unsupported v-else-if="selectedGame !== null"></unsupported>
    </div>
</template>

<script>

import unsupported from '@/components/game/Unsupported'
import { START_NEW_VOTE } from '@/store/actions'
import { SET_VOTE_CATEGORY, SET_VOTE_MODE } from '@/store/mutations'
import { NAMESPACE as ALL_GAMES } from '@/store/modules/games/allGames'
import { delayPromise } from '@/util'
var { VOTE_MODE_VIEWER, VOTE_MODE_STREAMER } = require('@shared/constants')

/*
2 ways to start a vote:
1. Click "start a vote"
2. Change game during broadcast 
    (b/c it would make no sense if current game was Dota, 
        and you saw league heroes in the vote results)

Vote type is implicitly set by the streamer's set game in twitch.
Otherwise, vote type is toggled by streamer in live config

Changing a game mid-broadcast will override current selected vote type
*/



export default {
    name: 'settings',
    data(){
        return {
            VOTE_MODE_STREAMER,
            voteModes:[VOTE_MODE_VIEWER,VOTE_MODE_STREAMER],
            introVoteCategory:"Select a character vote or a twitch game vote.",
            introVoteMode:"Free-for-all vs. whitelisted votes. You can configure the whitelist in the extension settings.",
            introStartVote:'Start a new vote with your selected options. Starting a vote clears the current vote.',
            showWhitelistTip: false,
            isLoading: false
        }
    },
    computed:{
        ...Vuex.mapState(['selectedGame','voteCategory','createdAt']),
        ...Vuex.mapGetters(['supportedGames','selectedGameModule']),
        voteCategorys(){
            return [this.selectedGame, ALL_GAMES]
        },
        selectedVoteCategory: {
            get () { return this.$store.state.voteCategory },
            set (voteCategory) { this.$store.commit(SET_VOTE_CATEGORY, voteCategory) }
        },
        selectedVoteMode: {
            get () { return this.$store.state.voteMode },
            set (voteMode) { this.$store.commit(SET_VOTE_MODE, voteMode) }
        },
        hasEmptyWhiteList(){
            if(!this.selectedGameModule)
                return false
            return this.selectedGameModule.whitelistedNames.length == 0;
        },
        isSupportedGame(){
            return this.supportedGames.includes(this.selectedGame) || this.selectedVoteCategory == ALL_GAMES
        }
    },
    watch:{
        selectedGame(newGame, oldGame){
            //do not start a vote on page load
            if(oldGame === null)
                return;
            this.$store.commit(SET_VOTE_CATEGORY, newGame)
            //changes game, implicitly changing vote category
            this.ensureHasWhitelist()
            this.$store.dispatch(START_NEW_VOTE)
        },//switches from selectedGame to all games
        voteCategory(mode){
            this.ensureHasWhitelist()
        },//manual click on radio
        selectedVoteMode(mode){
            this.ensureHasWhitelist()
        } 
    },
    methods:{
        async startVote(){
            this.$store.dispatch(START_NEW_VOTE)
            this.isLoading = true
            await delayPromise(750)
            this.isLoading = false
        },
        async ensureHasWhitelist(){
            if(this.selectedVoteMode == VOTE_MODE_STREAMER && this.hasEmptyWhiteList){
                this.selectedVoteMode = VOTE_MODE_VIEWER
                this.showWhitelistTip = true;
                await delayPromise(3000)
                this.showWhitelistTip = false
            }
        },
        showIntro(){
            introJs()
            .setOptions({
                tooltipPosition:'bottom-middle-aligned',
                tooltipClass:'vtp-tooltip',
                showBullets: false
            })
            .onbeforechange(function(el) {
                let padding = 40
                window.scrollTo(0,el.offsetTop - padding)
            })
            .start()
        }
    },
    components:{
        unsupported,
    }
}

</script>

<style lang="scss">

.live-config-settings {
    height: 100%;
    .vote-category, .vote-mode{
        min-width: 150px;
        
        input[type="radio"] {
            margin-top: -1px;
            vertical-align: middle;
        }
        .control label{
            font-size: .85em;
        }
    }
    .icon-help-circled{
        cursor: pointer;
        position: absolute;
        bottom:0;
        left:0;
        transition: .5s;
        opacity: .35;
        &:hover{
            opacity: 1;
        }
    }
}

.vtp-tooltip{
    .introjs-tooltiptext{
        font-size: 13px;
    }
}
</style>