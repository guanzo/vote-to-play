<template>
    <transition-group 
        v-if="candidates.length" 
        class="candidate-grid" 
        tag="div" 
        name="grid" 
        @before-leave="beforeLeave"
    >
        <candidate v-for="candidate in candidatesToShow"
            :candidate="candidate"
            :showNameInGrid="showNameInGrid"
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
import smoothHeight from 'vue-smooth-height'
import { NAMESPACE as ALL_GAMES }   from '@/store/modules/games/allGames'
/**
 * candidates may or may not be filterable
 */

//2 filtering modes
//highlight: leaves non-matched candidates in place, but darkens them
const FILTER_MODE_HIGHLIGHT = 'highlight'
//remove: removes non-matched candidates
const FILTER_MODE_REMOVE = 'remove'

export default {
    name:'candidate-grid',
    mixins:[smoothHeight],
    props:{
        candidates: Array,
        filteredCandidates: Array,
        whitelist: Array,
		showNameInGrid: Boolean,
		filterMode:{
			type: String,
			default: FILTER_MODE_HIGHLIGHT
		},
        noResults: {
            type: String,
            default: 'No Results'
        },//implemented by whitelist
        beforeLeave: {
            type: Function,
            default(){}//no op
        }
    },
    computed:{
        ...Vuex.mapState(['voteCategory','voteMode']),
        hasActiveFilter(){
            return this.filteredCandidates.length < this.candidates.length
		},
		candidatesToShow(){
			return this.filterMode === FILTER_MODE_HIGHLIGHT 
					? this.candidates 
					: this.filteredCandidates
		}
    },
    mounted(){
        this.$registerElement({
            el: this.$el,
            hideOverflow: true,
        })
    },
    methods:{
        selectCandidate(candidate){
            this.$store.commit(SELECT_CANDIDATE, candidate)
            this.$emit('selectCandidate',candidate)
        },
        filterClass(candidate){
            if(!this.hasActiveFilter || this.filterMode !== FILTER_MODE_HIGHLIGHT || this.voteCategory === ALL_GAMES)
                return ''
            return this.filteredCandidates.find(d=>d.name == candidate.name)
                    ? 'filtered-in': 'filtered-out'
        },
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

.grid-enter, .grid-leave-to{
    opacity: 0;
}
.grid-leave-active {
    position: absolute !important;
}
/* 
.grid-enter-active, .grid-leave-active{
    transition: 10s !important;
} */
</style>