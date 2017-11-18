<template>

<div class="whitelist">
    <candidate-grid :candidates="candidates"></candidate-grid>
</div>

</template>

<script>

import candidateGrid from '@/components/viewer/voter/CandidateGrid'

export default {
    name:'whitelist',
    props:['voteCategory'],
    computed:{
        ...Vuex.mapGetters({
            game: 'selectedGameModule'
        }),
        candidates(){
            return this.game.candidates
        }
    },
    components:{
        candidateGrid
    }
}

</script>

<style lang="scss">


</style>