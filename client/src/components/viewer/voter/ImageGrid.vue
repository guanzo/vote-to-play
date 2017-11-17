<template>
    <div class="image-grid candidate-pool" :style="justify">
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
    name:'image-grid',
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

.image-grid{
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
}
</style>