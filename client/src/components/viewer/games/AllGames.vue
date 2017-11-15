<template>

<div v-if="topGames.length" class="all-games overlay-background">
    {{ topGames }}
    <!-- <voter :heroes="heroes" :filteredHeroes="filteredHeroes">

        <div slot="filters">
            <input v-model="query" placeholder="Search hero name">
            <select v-model="selectedRole">
                <option>{{ DEFAULT_ROLE }}</option>
                <option v-for="role in roles" :key="role">{{ role }}</option>
            </select>
        </div>
    </voter>
    <vote-results :maxResults="maxResults"></vote-results> -->
</div>

</template>

<script> 

import voter from '@/components/viewer/voter/Voter'
import voteResults from '../voteresults/VoteResults'
import { GET_TOP_TWITCH_GAMES } from '@/store/actions'
import { NS_ALLGAMES } from '@/store/modules/games/allGames'

export default {
    name: 'all games',
    data(){
        return {
            query:'',
            maxResults: 5
        }
    },
    computed:{
        ...Vuex.mapState(NS_ALLGAMES,['topGames']),
    },
    created(){
        if(!this.topGames.length)
            this.$store.dispatch(NS_ALLGAMES+'/'+GET_TOP_TWITCH_GAMES)
    },
    methods:{
    },
    components:{
        voteResults,
        voter
    }
}
</script>

<style lang="scss">

.dota{
    //59x33 is original size.
    .image-wrapper{
        width: 59px;
        height: 33px;
    }
    .image-grid .image-wrapper{
        margin: 2px;
    }
}


</style>
