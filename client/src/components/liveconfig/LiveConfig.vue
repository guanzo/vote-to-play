<template>
<div class="live-config">
    <div><span @click="showIntro" class="icon-help-circled"></span></div>
    <div class="flex-center flex-column">
        <div class="vote-category field text-center m-b-10" :data-intro="introVoteCategory">
            <label class="label">Vote Category</label>
            <div class="control flex-center flex-column">
                <label v-for="voteCategory in voteCategorys" class="radio m-b-5" :key="voteCategory">
                    <input type="radio" v-model="selectedVoteCategory" :value="voteCategory"  name="vote-category">
                    {{ voteCategory }}
                </label>
            </div>
        </div>
        <div class="vote-mode field text-center m-b-10" :data-intro="introVoteMode">
            <label class="label">Vote Mode</label>
            <div class="control flex-center flex-column">
                <label v-for="voteMode in voteModes" class="radio m-b-5"  :key="voteMode">
                    <input type="radio" 
                        v-model="selectedVoteMode" 
                        :value="voteMode"
                        name="vote-mode" 
                        @change="onChange(voteMode)"
                    >
                    {{ voteMode }}
                </label>
                <div v-show="showWhitelistTip" class="help is-danger">You must configure a whitelist</div>
            </div>

        </div>
    </div>
    <br>
    <div v-if="showVoteResults">
        <div class="text-center">
            <button @click="startVote" class="button start-vote"  :data-intro="introStartVote">Start a vote</button>
            <p><small></small></p>
        </div>
        <vote-results class="vote-list">
        </vote-results>
    </div>
    <unsupported v-else-if="selectedGame !== null"></unsupported>
</div>
</template>

<script>
import { START_NEW_VOTE } from '@/store/actions'
import voteResults from '@/components/voteresults/VoteResults'
import unsupported from '@/components/viewer/games/Unsupported'
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
    name: 'live-config',
    data(){
        return {
            VOTE_MODE_STREAMER,
            voteModes:[VOTE_MODE_VIEWER,VOTE_MODE_STREAMER],
            introVoteMode:"Free-for-all vs. whitelisted votes. You can configure the whitelist in the extension settings.",
            introStartVote:'Initiate a new vote with your selected options. Starting a vote clears the current vote.',
            showWhitelistTip: false
        }
    },
    computed:{
        ...Vuex.mapState(['selectedGame','voteCategory']),
        ...Vuex.mapGetters(['supportedGames','selectedGameModule']),
        introVoteCategory(){
            if(!this.selectedGameModule)
                return ''
            let nomenclature = this.selectedGameModule.candidateNomenclature
            return `Start a ${nomenclature} vote or a twitch game vote.`
        },
        voteCategorys(){
            return [this.selectedGame, ALL_GAMES]
        },
        selectedVoteMode: {
            get () { return this.$store.state.voteMode },
            set (voteMode) { this.$store.commit(SET_VOTE_MODE, voteMode) }
        },
        selectedVoteCategory: {
            get () { return this.$store.state.voteCategory },
            set (voteCategory) { this.$store.commit(SET_VOTE_CATEGORY, voteCategory) }
        },

        hasEmptyWhiteList(){
            if(!this.selectedGameModule)
                return false
            return this.selectedGameModule.whitelistedNames.length == 0;
        },
        showVoteResults(){
            return this.supportedGames.includes(this.selectedGame) || this.selectedVoteCategory == ALL_GAMES
        }
    },
    watch:{
        selectedGame(newGame, oldGame){
            //do not start a vote on page load
            if(oldGame === null)
                return;
            this.$store.commit(SET_VOTE_CATEGORY, newGame)
            this.$store.dispatch(START_NEW_VOTE)
        },
    },
    methods:{
        startVote(){
            this.$store.dispatch(START_NEW_VOTE)
        },
        //cannot set whitelist mode if whitelist is empty
        async onChange(voteMode){
            console.log('param: ' + voteMode)
            if(voteMode == VOTE_MODE_STREAMER && this.hasEmptyWhiteList){
                this.selectedVoteMode = VOTE_MODE_VIEWER
                console.log(this.selectedVoteMode)
                this.showWhitelistTip = true;
                await delayPromise(3000)
                this.showWhitelistTip = false
            }
        },
        showIntro(){
            introJs()
            .setOptions({
                tooltipPosition:'bottom-middle-aligned',
                tooltipClass:'vtp-tooltip'
            })
            .onbeforechange(function(el) {
                let padding = 40
                window.scrollTo(0,el.offsetTop - padding)
            })
            .start()
        }
    },
    components:{
        voteResults,
        unsupported
    }
}
</script>


<style lang="scss">

.live-config{
    padding: 5px;
    color: #333;
    position: relative;
    .icon-help-circled{
        cursor: pointer;
    }
    .overlay-background {
        background: white;
    }
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
}

.vtp-tooltip{
    .introjs-tooltiptext{
        font-size: 14px;
    }
}
</style>
