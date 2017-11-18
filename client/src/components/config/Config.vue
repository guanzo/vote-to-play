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
        <p>You can toggle between "Viewer's choice" and "Streamer's choice" on your Dashboard.</p>
        <select v-model="selectedVoteCategory" id="vote-type">
            <option v-for="game in supportedGames" :key="game">
                {{game}}
            </option>
        </select>
        <whitelist :voteCategory="selectedVoteCategory"></whitelist>

    </div>
</template>

<script>
import whitelist from './Whitelist'

export default {
    name: 'config',
    data(){
        return {
            selectedVoteCategory: ''
        }
    },
    computed:{
        supportedGames(){
            return this.$store.getters.supportedGames.sort((a,b)=>a.localeCompare(b))
        }
    },
    created(){
        this.selectedVoteCategory = this.supportedGames[0]
    },
    components:{
        whitelist,
    }
}
</script>


<style lang="scss">

.config {
    color: #333;
    padding: 15px;
    p{
        margin-bottom: 15px;
    }
    .overlay-background {
        //background: white;
    }
}

</style>
