<template>
    <div class="candidate-grid">
        <template v-if="candidates.length">
            <div v-for="(candidate,i) in candidates"
                @click="selectCandidate(candidate)"
                class="candidate-wrapper"
                :key="candidate.name"
            >
                <slot :candidate="candidate" name="candidate">
                    <div class="image-wrapper candidate" :class="filterClass(candidate)" >
                        <img :src="candidate.img" :alt="candidate.name">
                    </div>
                </slot>
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
    props:['candidates','filteredCandidates'],
    computed:{
        hasActiveFilter(){
            return this.filteredCandidates.length < this.candidates.length
        },
    },
    created(){
    },
    methods:{
        selectCandidate(candidate){
            this.$store.commit(SELECT_CANDIDATE, { candidate })
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
    &.light .candidate:after{
        box-shadow: 0px 0px 2px 1px $light;
    }
    &.dark .candidate:after{
        box-shadow: 0px 0px 2px 1px $dark;
    }
    .image-wrapper{
        margin: 2px;
        position: relative;
        transition: .5s;
        //overflow: hidden;
    }
    .candidate {
        position: relative;
        transition: .5s;
        cursor: pointer;
        &.filtered-out {
            filter: brightness(20%);
        }
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
        &.filtered-in:after, &:hover:after {
            opacity: 1;
        }
    }
    .no-results {
        height: 100%;
    }
}
</style>