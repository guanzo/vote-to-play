<template>
    <div class="image-grid" :style="overflow">
        <div v-for="(candidate,i) in candidates"
            @click="selectCandidate(candidate)"
            :class="filterClass(candidate)" 
            class="image-wrapper" 
            :key="candidate.name"
        >
            <img :src="candidate.img" :alt="candidate.name">
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
        img {
            display: block;
        }
        cursor: pointer;
        &.filtered-out {
            filter: brightness(20%);
        }
        &.filtered-in {
            box-shadow: 0px 0px 2px 1px white;
        }
        &:hover:before {
            box-shadow: 0px 0px 0px 3px #eee inset;
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