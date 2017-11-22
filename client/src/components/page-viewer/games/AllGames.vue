<template>

<div v-if="topGames.length" class="all-games">
    <component :is="injectedComponent" v-bind="propsObj">
        <div slot="filters">
            <div v-for="filter in filters" class="control" :key="filter.id">
                <input v-if="filter.type == 'text'" 
                        v-model="filter.vmodel" 
                        :placeholder="filter.placeholder"
                        type="text"
                        class="input" :class="formClass"
                >
            </div>
        </div>
    </component>
</div>

</template>

<script> 

import voter from '@/components/page-viewer/voter/Voter'
import voteResults from '@/components/voteresults/VoteResults'
import { GET_TOP_TWITCH_GAMES } from '@/store/actions'
import { NAMESPACE as ALL_GAMES } from '@/store/modules/games/allGames'
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
        ...Vuex.mapState(ALL_GAMES,['topGames','searchedGames']),
        game(){
            return this.$store.state.games[ALL_GAMES]
        },
        propsObj(){
            let getters = this.$store.getters
            let candidates = getters[ALL_GAMES+'/candidates']
            let whitelistedCandidates = getters[ALL_GAMES+'/whitelistedCandidates']
            
            return {
                candidates,
                filteredCandidates: candidates,
                whitelistedCandidates,
                showName: this.game.showNameInGrid,
                voteCategory: this.voteCategory
            }
        },
        filters(){
            return this.game.filters
        },
        formClass(){
            return this.$route.path.includes('viewer') ? 'is-small' : ''
        }
    },
    watch:{
        'filters.0.vmodel'(query){
            this.searchGames(query)
        },
    },
    async created(){
        this.isLoading = true;
        await this.$store.dispatch(ALL_GAMES+'/'+GET_TOP_TWITCH_GAMES)
        this.isLoading = false
    },
    components:{
        voter,
        voteResults,
    }
}
</script>

<style lang="scss">

@mixin scale-img-size($width, $height, $scale: 1){
    width: $width * $scale;
    height: $height * $scale;
}

.all-games {
    
    $w: 72px;
    $h: 100px;
    img {
        width: 100%;
        height: auto;
    }
    .voter-header .image-wrapper{
        @include scale-img-size($w,$h,.75);
    }
    .image-wrapper{
        @include scale-img-size($w,$h);
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
