<template>
	<div class="live-config">
        <div class="pure-form pure-form-stacked flex-center flex-center-column">
            <label for="vote-type">Choose vote category</label>
            <select v-model="selectedVoteCategory" id="vote-type">
                <option v-for="voteCategory in voteCategorys" :key="voteCategory">
                    {{voteCategory}}
                </option>
            </select>
        </div>
        <br>
        <div v-if="showVoteResults">
            <div class="text-center">
                <button @click="startVote" class="pure-button start-vote">Start a vote</button>
                <p><small>Starting a vote clears the current vote.</small></p>
            </div>
            <vote-results :displayImages="false" class="vote-list">
            </vote-results>
        </div>
        <unsupported v-else></unsupported>
	</div>
</template>

<script>
import { START_NEW_VOTE } from '@/store/actions'
import voteResults from '@/components/viewer/voteresults/VoteResults'
import unsupported from '@/components/viewer/games/Unsupported'
import { SET_VOTE_CATEGORY } from '@/store/mutations'


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
            allGames: this.$store.state.allGames.gameName
        }
    },
    computed:{
        ...Vuex.mapState(['selectedGame','voteCategory']),
        ...Vuex.mapGetters(['supportedGames']),
        voteCategorys(){
            return [this.selectedGame, this.allGames]
        },
        selectedVoteCategory: {
            get () { return this.$store.state.voteCategory },
            set (value) { this.$store.commit(SET_VOTE_CATEGORY, { voteCategory: value }) }
        },
        gameIsSupported(){
            return this.supportedGames.includes(this.selectedGame)
        },
        showVoteResults(){
            return this.gameIsSupported || this.selectedVoteCategory == this.allGames
        }
    },
    watch:{
        selectedGame(newGame, oldGame){
            //do not start a vote on page load
            if(oldGame === null)
                return;
                
            this.$store.commit(SET_VOTE_CATEGORY, { voteCategory: newGame })
            this.$store.dispatch(START_NEW_VOTE)
        }
    },
    methods:{
        startVote(){
            this.$store.dispatch(START_NEW_VOTE)
        }
    },
    components:{
        voteResults,
        unsupported
    }
}
</script>


<style lang="scss">

$scrollbar-width: 17px;

.live-config{
    padding: 5px;
    color: #333;
    .overlay-background {
        background: white !important;
    }
    .vote-list.vote-results {
        margin-left: 0;
    }

}

</style>
