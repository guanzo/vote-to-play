<template>

<div class="whitelist">
    <candidate-grid></candidate-grid>
</div>

</template>

<script>

import candidateGrid from '@/components/viewer/voter/CandidateGrid'

export default {
    name:'whitelist',
    props:['voteCategory'],
    computed:{
        candidates(){
            
        }
    },
    components:{
        candidateGrid
    }
}

</script>

<style lang="scss">


</style>