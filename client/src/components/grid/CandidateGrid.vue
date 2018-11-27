<template>
    <transition-group
        v-if="candidatesToShow.length"
        class="candidate-grid"
        tag="div"
        name="grid"
        @before-leave="beforeLeave"
    >
        <component
            :is="candidateComponent"
            v-for="candidate in candidatesToShow"
            :candidate="candidate"
            :showNameInGrid="gameOptions.showNameInGrid"
            @click.native="selectCandidate(candidate)"
            :class="filterHighlightClass(candidate)"
            :key="getCandidateKey(candidate)"
        />
		<div v-if="showPaginationButton" class="show-more" key="paginate">
			<button @click="onPaginate"
				class="button is-small is-outlined"
			>Show more</button>
		</div>
    </transition-group>
    <div v-else class="no-results flex-center margin-center">
        {{ noResults }}
    </div>
</template>

<script>
import Candidate from './Candidate'
import smoothReflow from 'vue-smooth-reflow'
import {
	gameOptions, FILTER_MODE_HIGHLIGHT, FILTER_MODE_REMOVE
} from '@/store/modules/games/util/gameMixin'

const INITIAL_PAGE = 1;

export default {
    name:'candidate-grid',
    mixins:[smoothReflow],
    props:{
        candidates: Array,
        candidateComponent: {
            type: Object,
            default: Candidate
        },
        selectCandidate: {
            type: Function
        },
		filteredCandidates: Array,
		filters: Array,
		gameOptions:{
			type: Object,
			default: gameOptions()
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
	data(){
		return {
			page: 1,
			pageSize: 100,
		}
	},
    computed:{
        ...Vuex.mapState(['voteCategory','voteMode']),
        hasActiveFilter(){
            return this.filteredCandidates.length < this.candidates.length
		},
		candidatesToShow(){
			const { filterMode, hasPaginatedGrid } = this.gameOptions;
			let candidates;
			if(filterMode === FILTER_MODE_REMOVE)
				candidates = this.filteredCandidates
			else
				candidates = this.candidates;

			if(hasPaginatedGrid){
				const size = this.page * this.pageSize;
				candidates = candidates.slice(0,size)
			}
			return candidates;
		},
		showPaginationButton(){
			const size = this.page * this.pageSize;
			return this.gameOptions.hasPaginatedGrid && size < this.filteredCandidates.length;
		}
	},
	watch:{
		filters(){
			this.resetPagination();
		},
	},
    mounted(){
        this.$smoothReflow()
    },
    methods:{
		//v1.7 compatibility. all-games saved in whitelist won't have id
		getCandidateKey(candidate){
			return candidate.id || candidate.name
		},
        filterHighlightClass(candidate){
            if(!this.hasActiveFilter ||
                this.gameOptions.filterMode !== FILTER_MODE_HIGHLIGHT)
                return ''
            const isFiltered = this.filteredCandidates.find(d=>d.name === candidate.name)
            return isFiltered ? 'filtered-in': 'filtered-out'
		},
		onPaginate(){
			this.page++;
		},
		resetPagination(){
			this.page = INITIAL_PAGE;
		}
    },
    components:{
        Candidate
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
	align-items: center;
	align-content: flex-start;
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
	.show-more {
		width: 100%;
		text-align: center;
		padding: 10px 0px;
	}
}

.grid-enter, .grid-leave-to{
    opacity: 0;
}
.grid-leave-active {
    transition: 0.1s;
	position: absolute !important;
	z-index: -1;
}

</style>
