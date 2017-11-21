<template>
    <transition-group 
        v-if="candidates.length" 
        class="candidate-grid" 
        tag="div" 
        name="list" 
        @before-leave="beforeLeave"
    >
        <candidate v-for="(candidate,i) in candidates"
            :candidate="candidate"
            :showName="showName"
            @click.native="selectCandidate(candidate)"
            :class="filterClass(candidate)" 
            :key="candidate.name"
        >
        </candidate>
    </transition-group>
    <div v-else class="no-results flex-center margin-center">
        {{noResults}}
    </div>
</template>

<script>
import candidate from './Candidate'
import { SELECT_CANDIDATE } from '@/store/mutations'
/**
 * candidates may or may not be filterable
 */
export default {
    name:'candidate-grid',
    props:{
        candidates: Array,
        filteredCandidates: Array,
        whitelist: Array,
        showName: Boolean,
        noResults: {
            type: String,
            default: 'No Results'
        }
    },
    computed:{
        hasActiveFilter(){
            return this.filteredCandidates.length < this.candidates.length
        },
    },
    methods:{
        selectCandidate(candidate){
            this.$store.commit(SELECT_CANDIDATE, candidate)
            this.$emit('selectCandidate',candidate)
        },
        filterClass(candidate){
            if(!this.hasActiveFilter)
                return ''
            return this.filteredCandidates.find(d=>d.name == candidate.name)
                    ? 'filtered-in': 'filtered-out'
        },
        beforeLeave(el){
            el.style.top = el.offsetTop + 'px'
            el.style.left = el.offsetLeft + 'px'
        }
    },
    components:{
        candidate
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
    &.filtered-out {
        filter: brightness(25%);
    }
    &.filtered-in:after{
        opacity: 1;
    }
}

.list-enter, .list-leave-to{
    opacity: 0;
}
.list-leave-active {
    position: absolute !important;
}
</style>