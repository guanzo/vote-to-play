<template>
    <transition-group 
        v-if="candidatesToShow.length" 
        class="candidate-grid"
        tag="div" 
        name="grid" 
        @before-leave="beforeLeave"
    >
        <candidate v-for="candidate in candidatesToShow"
            :candidate="candidate"
            :showNameInGrid="gameOptions.showNameInGrid"
            @click.native="selectCandidate(candidate)"
            :class="filterHighlightClass(candidate)" 
            :key="getCandidateKey(candidate)"
        >
        </candidate>
		<div v-if="showPaginationButton" class="show-more" key="paginate">
			<button @click="onPaginate"
				class="button is-small is-outlined"
			>Show more</button>
		</div>
    </transition-group>
    <div v-else class="no-results flex-center margin-center">
        {{noResults}}
    </div>
</template>

<script>
import candidate from './Candidate'
import { SELECT_CANDIDATE } from '@/store/mutations'
import smoothHeight from 'vue-smooth-height'
import { 
	gameOptions, FILTER_MODE_HIGHLIGHT, FILTER_MODE_REMOVE, FILTER_MODE_NONE 
} from '@/store/modules/games/util/gameMixin'

const INITIAL_PAGE = 1;

export default {
    name:'candidate-grid',
    mixins:[smoothHeight],
    props:{
        candidates: Array,
        filteredCandidates: Array,
		whitelist: Array,
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
			let { filterMode, hasPaginatedGrid } = this.gameOptions;
			let candidates;
			if(filterMode === FILTER_MODE_REMOVE)
				candidates = this.filteredCandidates
			else
				candidates = this.candidates;

			if(hasPaginatedGrid){
				let size = this.page * this.pageSize;
				candidates = candidates.slice(0,size)
			}
			return candidates;
		},
		showPaginationButton(){
			let size = this.page * this.pageSize;
			return this.gameOptions.hasPaginatedGrid && size < this.filteredCandidates.length;
		}
	},
	watch:{
		filteredCandidates(){
			this.resetPagination();
		}
	},
    mounted(){
        this.$registerElement({
            el: this.$el,
            hideOverflow: true,
        })
    },
    methods:{
		//v1.7 compatibility. all-games saved in whitelist won't have id
		getCandidateKey(candidate){
			return candidate.id || candidate.name
		},
        selectCandidate(candidate){
            this.$store.commit(SELECT_CANDIDATE, candidate)
            this.$emit('selectCandidate',candidate)
        },
        filterHighlightClass(candidate){
            if(!this.hasActiveFilter || this.gameOptions.filterMode !== FILTER_MODE_HIGHLIGHT)
                return ''
            return this.filteredCandidates.find(d=>d.name == candidate.name)
                    ? 'filtered-in': 'filtered-out'
		},
		onPaginate(){
			this.page++;
		},
		resetPagination(){
			this.page = INITIAL_PAGE;
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
    position: absolute !important;
}

</style>