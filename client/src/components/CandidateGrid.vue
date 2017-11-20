<template>
    <div class="candidate-grid">
        <template v-if="candidates.length">
            <div v-for="(candidate,i) in candidates"
                @click="selectCandidate(candidate)"
                class="candidate"
                :class="filterClass(candidate)" 
                :key="candidate.name"
            >
                <div class="image-wrapper">
                    <img :src="candidate.img" :alt="candidate.name">
                </div>
                <div v-if="showName" class="candidate-name">
                    <div class="ellipsis">{{ candidate.name }}</div>
                </div>
            </div>
        </template>
        <div v-else class="no-results flex-center margin-center">
            No Results
        </div>
    </div>
</template>

<script>
import { SELECT_CANDIDATE } from '@/store/mutations'
/**
 * candidates may or may not be filterable
 */
export default {
    name:'candidate-grid',
    props:['candidates','filteredCandidates','whitelist','showName'],
    computed:{
        hasActiveFilter(){
            return this.filteredCandidates.length < this.candidates.length
        },
    },
    methods:{
        selectCandidate(candidate){
            this.$store.commit(SELECT_CANDIDATE, { candidate })
            this.$emit('selectCandidate',candidate)
        },
        filterClass(candidate){
            if(!this.hasActiveFilter)
                return ''
            return this.passesFilter(candidate) ? 'filtered-in': 'filtered-out'
        },
        passesFilter(candidate){
            return this.filteredCandidates.find(d=>d.name == candidate.name)
        },
    }
}

</script>

<style lang="scss" scoped>

$light: #eee;
$dark: #333;

.candidate-grid {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    overflow-y: auto;
    overflow-x: hidden;
    transition: .5s;
    user-select: none;
    &.light .candidate:after{
        box-shadow: 0px 0px 2px 1px $light;
    }
    &.dark .candidate:after{
        box-shadow: 0px 0px 2px 1px $dark;
    }
    .no-results {
        height: 100%;
    }
}


.candidate {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2px;
    transition: .3s;
    .image-wrapper{
        position: relative;
    }
    .candidate-name {
        max-width: 100%;
        padding: 0px 2px;
    }
    cursor: pointer;
    &:after{
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        opacity: 0;
        transition: opacity 0.3s;
    }
}

.voter .candidate{

    &.filtered-out {
        filter: brightness(25%);
    }
    &.filtered-in:after, &:hover:after {
        opacity: 1;
    }
}

.whitelist .candidate{
    &:before{
        font-family: "icons";
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 1;
        font-size: 14px;
        text-shadow:
            -1px -1px 0 #eee,  
            1px -1px 0 #eee,
            -1px 1px 0 #eee,
            1px 1px 0 #eee;
    }
    &.filtered-out:before {
        //filter: brightness(25%);
        content: '\e802';
        color:red;
    }
    &.filtered-in:before{
        //opacity: 1;
        content: '\e800';
        color:green;
    }
}
</style>