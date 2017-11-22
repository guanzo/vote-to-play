<template>

<div v-if="topGames.length" class="all-games">
    <component :is="injectedComponent" v-bind="propsObj">
        <div slot="filters">
            <!-- <div v-for="filter in game.filters" class="control" :key="filter.id">
                <input v-if="filter.type == 'text'" 
                        v-model="filter.vmodel" 
                        :placeholder="filter.placeholder"
                        type="text"
                        class="input" :class="formClass"
                >
            </div> -->
            
            <div class="control">
                <input v-model="query" :class="formClass" class="input" placeholder="Search games">
            </div>
        </div>
    </component>
</div>

</template>

<script> 

import voter from '@/components/page-viewer/voter/Voter'
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
        game(){
            return this.$store.state.games[NAMESPACE]
        },
        propsObj(){
            let game = this.game;
            return {
                candidates: this.candidates,
                filteredCandidates: this.candidates,
                whitelistedCandidates: this.whitelistedCandidates,
                showName: game.showNameInGrid,
                voteCategory: this.voteCategory
            }
        },
        candidates(){
            return this.query.length ? this.searchedGames : this.topGames
        },
        whitelistedCandidates(){
            return this.$store.getters[NAMESPACE+'/whitelistedCandidates']
        },
        formClass(){
            return this.$route.path.includes('viewer') ? 'is-small' : ''
        }
    },
    watch:{
        query(query){
            this.searchGames(query)
        },
        whitelistedCandidates(){
            console.log(arguments)
        }
    },
    async created(){
        this.isLoading = true;
        await this.$store.dispatch(NAMESPACE+'/'+GET_TOP_TWITCH_GAMES)
        this.isLoading = false
    },
    components:{
        voter,
        voteResults,
    }
}
</script>

<style lang="scss">

.all-games {
    
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
    .vote-form{
        overflow: hidden;
        flex: 1; //ensure always full width, so the div doesn't jump around when querying
    }
    .candidate{
        max-width: 72px;
        font-size: 12px;
        margin: 3px;
    }
}


</style>
