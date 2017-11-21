<template>
	<div class="config">
        <h3>Thanks for installing Vote to Play!</h3>
        <p>
            If you want viewers to vote on game characters, make sure you set the game in your stream information.<br>
            For example, if you want viewers to vote on a Dota 2 hero, make sure to set Dota 2 as the game on Twitch, and click "Start a Vote".
        </p>
		<p>
            If you want viewers to vote on games, select "All Games" as the vote category, and click "Start a Vote".
        </p>
        <p>You can do all this on your Dashboard - Live.</p>
        <p>Remember, you also get to vote!</p>
        <br>
        If you would like to suggest any features, please feel free to email me.
        <h3>Settings</h3>
        <p>By default, viewers can vote on any candidate in the pool. If you want viewers to vote only on specific candidates, you can configure that here.</p>
        <p>You can toggle between "{{ VOTE_MODE_VIEWER }}" and "{{ VOTE_MODE_STREAMER }}" on your Dashboard.</p>
        <div class="select">
            <select v-model="selectedVoteCategory" id="vote-type" class="m-b-15">
                <option v-for="game in supportedGames" :key="game">
                    {{game}}
                </option>
            </select>
        </div>
        <game-master 
            v-if="voteCategory" 
            :injectedComponent="whitelist" 
            :voteCategory="selectedVoteCategory"
        ></game-master>

    </div>
</template>

<script>
import whitelist from './whitelist/Whitelist'
import GameMaster from '@/components/viewer/games/_GameMaster'

var { VOTE_MODE_VIEWER, VOTE_MODE_STREAMER } = require('@shared/constants')

export default {
    name: 'config',
    data(){
        return {
            selectedVoteCategory: '',
            whitelist,
            VOTE_MODE_VIEWER,
            VOTE_MODE_STREAMER
        }
    },
    computed:{
        ...Vuex.mapState(['voteCategory']),
        supportedGames(){
            return this.$store.getters.supportedGames.sort((a,b)=>a.localeCompare(b))
        },
    },
    watch:{
        //change game when streamer does, 
        //cannot be computed property to also allow streamer to change game thru select
        voteCategory(newCategory, oldCategory){
            this.selectedVoteCategory = newCategory
        }
    },
    components:{
        GameMaster
    }
}
</script>


<style lang="scss" scoped>

.config {
    color: #333;
    padding: 15px;
    p{
        margin-bottom: 15px;
    }
    .overlay-background {
        //background: white;
    }
    /deep/ .game{
        min-height: 400px;
    }
}

</style>
