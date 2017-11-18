<template>

<div class="all-games">
    <voter class="voter-all-games" :candidates="candidates" :filteredCandidates="candidates">
        <div class="game" slot-scope="{ candidate }" slot="candidate">
            <div class="image-wrapper candidate">
                <img :src="candidate.img">
            </div>
            <div class="game-name">
                <div class="ellipsis">{{ candidate.name }}</div>
            </div>
        </div>
        <div slot="filters">
            <input v-model="query" placeholder="Search games">
        </div>
    </voter>
    <vote-results :displayImages="false"  :maxResults="maxResults"></vote-results>
</div>

</template>

<script> 

import voter from '@/components/viewer/voter/Voter'
import voteResults from '@/components/voteresults/VoteResults'
import { GET_TOP_TWITCH_GAMES } from '@/store/actions'
import { NS_ALLGAMES } from '@/store/modules/games/allGames'
import allGamesSearch from './AllGamesSearch'


/*
If no query, show popular games, else show games that match query

too much work to display images for any game..
*/

export default {
    name: 'all-games',
    mixins:[allGamesSearch],
    data(){
        return {
            query:'',
            maxResults: 5,
        }
    },
    computed:{
        ...Vuex.mapState(NS_ALLGAMES,['topGames','searchedGames']),
        candidates(){
            return this.query.length ? this.searchedGames : this.topGames
        }
    },
    watch:{
        query(query){
            this.searchGames(query)
        }
    },
    created(){
        this.$store.dispatch(NS_ALLGAMES+'/'+GET_TOP_TWITCH_GAMES)
    },
    components:{
        voter,
        voteResults,
    }
}
</script>

<style lang="scss">

.all-games{
    
    img {
        width: 100%;
        height: auto;
    }
    .voter-header .image-wrapper{
        width: 52px;
        height: 72px;
    }
    .image-wrapper{
        width: 72px;
        height: 100px;
    }
    .voter-all-games{
        overflow: hidden;
        flex: 1; //ensure always full width, so the div doesn't jump around when querying
        .game{
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 72px;
            font-size: 12px;
            margin: 3px;
            .game-name {
                max-width: 100%;
            }
        }
    }
}


</style>
