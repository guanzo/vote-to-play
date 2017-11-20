<template>

<div class="whitelist">
    
    <candidate-grid 
        v-if="candidates.length" 
        :candidates="candidates" 
        :filteredCandidates="whitelistedCandidates"
        @selectCandidate="onSelectCandidate"
        class="candidate-grid dark m-b-15"
    ></candidate-grid>
    <whitelist-controls>
        <!-- <slot name="filters"></slot> -->
    </whitelist-controls>
</div>

</template>

<script>

import { GET_CANDIDATES } from '@/store/actions'
import candidateGrid from '@/components/CandidateGrid'
import whitelistControls from './WhitelistControls'
export default {
    name:'whitelist',
    props:['candidates','filteredCandidates','voteCategory','whitelist'],
    data(){
        return {
            whitelistedCandidates:[]
        }
    },
    watch:{
        voteCategory(){

        },
        whitelist(){
            
        }
    },
    created(){
        
    },
    methods:{
        onSelectCandidate(candidate){
            let index = _.findIndex(this.whitelistedCandidates,d=>d.name == candidate.name)
            if(index == -1)
                this.whitelistedCandidates.push(candidate)
            else
                this.whitelistedCandidates.splice(index,1)
        }
    },
    components:{
        candidateGrid,
        whitelistControls
    }
}

</script>

<style lang="scss">

.whitelist{
    padding: 15px;
    .candidate-grid{
        min-height: 400px;
    }
}

</style>