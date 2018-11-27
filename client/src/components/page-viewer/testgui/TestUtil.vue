<template>
    <div v-if="IS_DEVELOPMENT" class="test-util">
        <select v-model="selectedGameVModel">
            <option v-for="game in games" :key="game">{{ game }}</option>
        </select>
        <div class="toggle-vote-simulation">
            Simulate Votes:
            <input type="checkbox" v-model="isSimulating">
        </div>
        <button @click="resetVote">reset vote</button>
    </div>
</template>

<script>
import { TOGGLE_VOTE_SIMULATION, SET_GAME, SET_VOTE_CATEGORY } from '@/store/mutations'

import API from '@/api/api'
import voteApi from '@/api/vote-api'
import { NAMESPACE as ALL_GAMES } from '@/store/modules/games/allGames'
const { VOTE_MODE_VIEWER } = require('@shared/constants')

export default {
    name: 'test-util',
    data(){
        return {
            selectedGameModel: 'Dota 2',
            intervalID: 0,
            maxSimulationVotes: 200,
            voteDelay: 150
        }
    },
    computed:{
        ...Vuex.mapState([
            'selectedGame','TESTING', 'userId','channelId', 'currentVote','voteMode'
        ]),
        IS_DEVELOPMENT(){ return this.TESTING.IS_DEVELOPMENT },
        games(){
            return [...this.$store.getters.supportedGames, 'Unsupported']
        },
        votes(){
            return this.currentVote.votes;
        },
        game(){
            return this.$store.getters.selectedGameModule
        },
        candidates(){
            return this.$store.getters[this.game.gameName+'/candidates']
        },
        whitelistedCandidates(){
            return this.$store.getters[this.game.gameName+'/whitelistedCandidates']
        },
        votableCandidates(){
            if(this.voteMode === VOTE_MODE_VIEWER)
                return this.candidates
            else
                return this.whitelistedCandidates
        },
        isAllGames(){
            return this.game.gameName === ALL_GAMES
        },
        isSimulating: {
            get () {
                return this.TESTING.isSimulating
            },
            set (value) {
                this.$store.commit(TOGGLE_VOTE_SIMULATION, value)
            }
        },
        selectedGameVModel: {
            get () {
                return this.$store.state.voteCategory
            },
            set (game) {
                this.$store.commit(SET_GAME, game)
                this.$store.commit(SET_VOTE_CATEGORY, game)
            }
        },
    },
    watch:{
        ['votes.length'](){
            if(!this.isSimulating)
                return;

            if(this.votes.length >= this.maxSimulationVotes){
                voteApi.startVote()
            }else if(this.votes.length === 0){
                clearInterval(this.intervalID)
                this.intervalID = this.simulateVotes()
            }
        },
        isSimulating(){
            if(this.isSimulating)
                this.intervalID = this.simulateVotes()
            else
                clearInterval(this.intervalID)
        }
    },
    methods:{
        toggleVoteSimulation(){
            this.$store.commit(TOGGLE_VOTE_SIMULATION)
        },
        resetVote(){
            voteApi.startVote()
        },
        simulateVotes(){
            if(this.votableCandidates.length === 0)
                return;
			const { userId, channelId } = this
            const candidatePool = Math.min(25, this.votableCandidates.length);
            const intervalID = setInterval(()=>{
                const candidateIndex = randIntBetween(0, candidatePool-1)
                const candidateName = this.votableCandidates[candidateIndex].name
                const url = `channels/${channelId}/fakevotes`
				API.post(url, { userId, vote: candidateName })
            },250)
            return intervalID
        },
    },
}
function randIntBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}
</script>

<style lang="scss" scoped>

.test-util{
    display: flex;
    > * {
        margin: 0px 5px;
    }
    .toggle-vote-simulation{
        background: grey;
        padding: 3px;
    }
}


</style>
