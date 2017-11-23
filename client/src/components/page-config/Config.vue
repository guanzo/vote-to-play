<template>
	<div class="config">
        <h3 class="title">Thanks for installing Vote to Play!</h3>
        <p>
            If you want viewers to vote on game characters, make sure you set the game in your stream information.<br>
            For example, if you want viewers to vote on a Dota 2 hero, make sure to set Dota 2 as the game on Twitch, and click <example v-html="startVoteExample"></example>
        </p>
		<p>
            If you want viewers to vote on games, select
            <example v-html="radioBtnSample('All Games')"></example>
            under <example class="tag is-medium"><b>Vote Category</b></example>, and click <example v-html="startVoteExample"></example>
        </p>
        <p>You can do all this on your Live Dashboard.</p>
        <p>Remember, you also get to vote!</p>
        <p>If you would like to suggest any features, please feel free to email me.</p>

        <h3 class="title is-4">Settings</h3>
        <p>By default, viewers can vote on any candidate in the pool.<br>If you want viewers to vote only on specific candidates, you can configure that here. Make sure to save your changes.</p>
        <p>You can toggle between 
            <example v-html="radioBtnSample( VOTE_MODE_VIEWER )"></example>
            and 
            <example v-html="radioBtnSample( VOTE_MODE_STREAMER )"></example>
            under <example class="tag is-medium"><b>Vote Mode</b></example>
            on your Live Dashboard.
        </p>
        <div class="select">
            <select v-model="selectedVoteCategory" id="vote-type" class="m-b-15">
                <option v-for="game in supportedGames" :key="game">
                    {{game}}
                </option>
            </select>
        </div>
        
        <div class="box">
        
            <game-master 
                v-if="voteCategory" 
                :injectedComponent="whitelist" 
                :voteCategory="selectedVoteCategory"
            ></game-master>
        </div>

    </div>
</template>

<script>
import whitelist from './Whitelist'
import GameMaster from '@/components/game/_GameMaster'

var { VOTE_MODE_VIEWER, VOTE_MODE_STREAMER } = require('@shared/constants')

export default {
    name: 'config',
    data(){
        return {
            selectedVoteCategory: '',
            whitelist,
            VOTE_MODE_VIEWER,
            VOTE_MODE_STREAMER,
            startVoteExample: '<button class="button is-small is-static">Start a vote</button>'
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
    methods:{
        radioBtnSample(label){
            return `<label class="radio"><input type="radio" disabled> ${label}</label>`
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
    example{
        margin: 0px 5px;
        pointer-events: none;
    }
    /deep/ .game{
        min-height: 400px;
    }
}

</style>
