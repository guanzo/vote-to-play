<template>

<div class="whitelist">
    {{ candidates.length }}
    <candidate-grid :candidates="candidates"></candidate-grid>
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
            console.log(this.game)

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