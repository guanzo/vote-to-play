<template>

<div class="whitelist">
    <candidate-grid 
        v-if="candidates.length" 
        :candidates="candidates" 
        :filteredCandidates="filteredCandidates"
        class="m-b-15"
    ></candidate-grid>
    <whitelist-controls>
        <slot name="filters"></slot>
    </whitelist-controls>
</div>

</template>

<script>

import { GET_CANDIDATES } from '@/store/actions'
import candidateGrid from '@/components/viewer/voter/CandidateGrid'
import whitelistControls from './WhitelistControls'
export default {
    name:'whitelist',
    props:['candidates','filteredCandidates','voteCategory'],
    computed:{
    },
    watch:{
    },
    created(){
        
    },
    components:{
        candidateGrid,
        whitelistControls
    }
}

</script>

<style lang="scss">


</style>