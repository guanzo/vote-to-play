<template>

<div v-if="topGames.length" class="all-games">
    <component :is="injectedComponent"
        :candidates="candidates" 
        :filteredCandidates="candidates"
        class="voter-all-games" 
    >
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
    </component>
</div>

</template>

<script> 

import voter from '@/components/viewer/voter/Voter'
import voteResults from '@/components/voteresults/VoteResults'
import { GET_TOP_TWITCH_GAMES } from '@/store/actions'
import { NAMESPACE } from '@/store/modules/games/allGames'
import allGamesSearch from './AllGamesSearch'

/*
If no query, show popular games, else show games that match query

too much work to display images for any game..
*/

export default {
    name: 'all-games',
    mixins:[allGamesSearch],
    props:['injectedComponent','voteCategory'],
    data(){
        return {
            query:'',
            isLoading: false,
        }
    },
    computed:{
        ...Vuex.mapState(NAMESPACE,['topGames','searchedGames']),
        candidates(){
            return this.query.length ? this.searchedGames : this.topGames
        }
    },
    watch:{
        query(query){
            this.searchGames(query)
        }
    },
    async created(){
        this.isLoading = true;
        await this.$store.dispatch(NAMESPACE+'/'+GET_TOP_TWITCH_GAMES)
        setTimeout(()=>{
            this.isLoading = false
        },2000)
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
    .voter-all-games .vote-form{
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
