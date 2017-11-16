<template>
    <div class="image-grid candidate-pool" :style="overflow">
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
    </div>
</template>

<script>
import { SELECT_CANDIDATE } from '@/store/mutations'

export default {
    name:'image-grid',
    props:['candidates','filteredCandidates'],
    computed:{
        hasActiveFilter(){
            return this.filteredCandidates.length < this.candidates.length
        },
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
    position: relative;
    display: flex;
    flex-wrap: wrap;
    margin: 10px 0px;
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