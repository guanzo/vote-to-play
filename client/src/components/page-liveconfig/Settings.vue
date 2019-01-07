<template>
    <div class="live-config-settings flex-center flex-column has-text-centered">
        <span @click="showIntro" class="icon-help-circled" />
        <div class="vote-category field m-b-5" :data-intro="introVoteCategory">
            <label class="label">Vote Category</label>
            <div class="control flex-center flex-column">
                <label v-for="voteCategory in voteCategorys" class="radio m-b-5" :key="voteCategory">
                    <input type="radio" v-model="selectedVoteCategory" :value="voteCategory" name="vote-category">
                    {{ voteCategory }}
                </label>
            </div>
        </div>
        <template v-if="isSupportedGame">
            <div class="vote-mode field m-b-5" :data-intro="introVoteMode">
                <label class="label">Vote Mode</label>
                <div class="control flex-center flex-column">
                    <label v-for="voteMode in voteModes" class="radio m-b-5" :key="voteMode">
                        <input type="radio"
                            v-model="selectedVoteMode"
                            :value="voteMode"
                            name="vote-mode"
                        >
                        {{ voteMode }}
                    </label>
                </div>
            </div>
            <div
                :style="{visibility: showWhitelistWarning ? 'visible':'hidden'}"
                class="help is-danger m-b-5">
                You must create a whitelist to use this mode
            </div>
            <button @click="startVote"
                    :class="startVoteBtnClass"
                    class="start-vote button"
                    :data-intro="introStartVote"
            >
                Start a vote
            </button>
        </template>
        <nogame v-else-if="selectedGame === NO_GAME" />
        <unsupported v-else-if="selectedGame !== null" />
    </div>
</template>

<script>

import unsupported from '@/components/game/Unsupported'
import nogame from '@/components/game/NoGame'
import voteApi from '@/api/vote-api'
import { SET_VOTE_CATEGORY, SET_VOTE_MODE } from '@/store/mutations'
import { NAMESPACE as ALL_GAMES } from '@/store/modules/games/allGames'
import { timeout } from '@/util'
const { VOTE_MODE_VIEWER, VOTE_MODE_STREAMER, NO_GAME } = require('@shared/constants')

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
            NO_GAME,
            voteModes:[VOTE_MODE_VIEWER,VOTE_MODE_STREAMER],
            introVoteCategory:"Select a character vote or a twitch game vote.",
            introVoteMode:"Free-for-all vs. whitelisted votes. You can configure the whitelist in the extension settings.",
            introStartVote:'Start a new vote with your selected options. Starting a vote clears the current vote.',
            showWhitelistWarning: false,
            isLoading: false
        }
    },
    computed:{
        ...Vuex.mapState(['selectedGame']),
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
        hasInvalidVoteMode(){
            const { selectedGameModule } = this
            return this.selectedVoteMode === VOTE_MODE_STREAMER &&
                selectedGameModule &&
                selectedGameModule.whitelistedNames.length === 0
        },
        isSupportedGame(){
            return this.supportedGames.includes(this.selectedGame) ||
                this.selectedVoteCategory === ALL_GAMES
        },
        startVoteBtnClass(){
            if(this.isLoading)
                return 'is-success is-loading'
            else if(this.showWhitelistWarning)
                return 'is-danger'
            else
                return ''
        }
    },
    watch:{
        selectedGame(newGame, oldGame){
            //do not start a vote on page load
            if(oldGame === null) {
                return
            }
            this.$store.commit(SET_VOTE_CATEGORY, newGame)
            //changes game, implicitly changing vote category
            if(this.hasInvalidVoteMode) {
                this.ensureValidVoteMode(true)
            }
            voteApi.startVote()
        },
    },
    methods:{
        async startVote(){
            if(this.hasInvalidVoteMode) {
                return this.ensureValidVoteMode()
            }

            this.showWhitelistWarning = false
            this.isLoading = true

            try {
                await voteApi.startVote()
            } catch (e) {
                cl(e)
            } finally {
                this.isLoading = false
            }

        },//autofix invalid whitelist mode when streamer changes game, b/c a new vote is forced
        async ensureValidVoteMode(autochangeVoteMode = false){
            if(autochangeVoteMode) {
                this.selectedVoteMode = VOTE_MODE_VIEWER
            }

            this.showWhitelistWarning = true;
            await timeout(5000)
            this.showWhitelistWarning = false

        },
        showIntro(){
            introJs()
            .setOptions({
                tooltipPosition:'bottom-middle-aligned',
                tooltipClass:'vtp-tooltip',
                showBullets: false
            })
            .onbeforechange(el => {
                const padding = 40
                window.scrollTo(0,el.offsetTop - padding)
            })
            .start()
        }
    },
    components:{
        unsupported,
        nogame
    }
}

</script>

<style lang="scss">

.live-config-settings {
    min-height: 100%;
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
    .start-vote{
        transition: .35s;
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
