<template>
    <div class="candidate-grid" :style="justify">
        <template v-if="candidates.length">
            <div v-for="(candidate,i) in candidates"
                @click="selectCandidate(candidate)"
                :key="candidate.name"
            >
                <slot :candidate="candidate" name="candidate">
                    <div class="image-wrapper candidate" :class="filterClass(candidate)" >
                        <img :src="candidate.img" :alt="candidate.name">
                    </div>
                </slot>
            </div>
        </template>
        <div v-else class="flex-center">
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
        justify(){
            return {
                'justify-content': this.candidates.length ? 'start' : 'center'
            }
        }
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

.candidate-grid{
    grid-area: main;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;
    overflow-x: hidden;
    transition: .5s;
    .image-wrapper{
        margin: 2px;
        position: relative;
        transition: .5s;
        overflow: hidden;
    }
    .candidate {
        position: relative;
        transition: .5s;
        cursor: pointer;
        &.filtered-out {
            filter: brightness(20%);
        }
        &.filtered-in {
            box-shadow: 0px 0px 2px 1px white;
        }
        &:hover:before {
            box-shadow: 0px 0px 0px 2px #eee inset;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            content: "";
        }
    }
}
</style>