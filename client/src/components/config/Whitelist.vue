<template>

<div class="whitelist">
    <candidate-grid 
        v-if="candidates.length" 
        :candidates="candidates" 
        :filteredCandidates="candidates"
    ></candidate-grid>
</div>

</template>

<script>

import { GET_CANDIDATES } from '@/store/actions'
import candidateGrid from '@/components/viewer/voter/CandidateGrid'

export default {
    name:'whitelist',
    props:['voteCategory'],
    computed:{
        ...Vuex.mapGetters(['gameModuleByName']),
        game(){
            return this.gameModuleByName(this.voteCategory)
        },
        candidates(){
            return this.game.candidates;
        }
    },
    watch:{
        voteCategory(){
            if(this.candidates.length)
                return;

            let namespace = this.game.gameName
            this.$store.dispatch(namespace+'/'+GET_CANDIDATES)
        }
    },
    created(){
        console.log(this.$store)
    },
    components:{
        candidateGrid
    }
}

</script>

<style lang="scss">


</style>