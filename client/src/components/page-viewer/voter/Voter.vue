<template>
<div class="voter">
    <transition name="fade-vertical">
        <div v-show="showUI" class="vote-form viewer-ui-block">
            <VoterHeader
                :hasSelectedCandidate="hasSelectedCandidate"
                :selectedCandidate="selectedCandidate"
                :class="isInvisible"
             />
            <CandidateGrid
                v-bind="$attrs"
                :candidates="votableCandidates"
                :candidateComponent="CandidateVote"
                :selectCandidate="selectCandidate"
				:filteredCandidates="votableFilteredCandidates"
                :class="[isInvisible, 'candidate-grid light']"
            />
            <VoterControls
                :hasSelectedCandidate="hasSelectedCandidate"
                :hasSubmittedVote="hasSubmittedVote"
                :selectedVote="selectedCandidate.name"
                :class="isInvisible"
            >
                <slot name="controls" />
            </VoterControls>
        </div>
    </transition>
    <VoteResults class="results"/>
</div>

</template>

<script>

import VoterHeader from './VoterHeader'
import CandidateGrid from '@/components/grid/CandidateGrid'
import CandidateVote from '@/components/grid/CandidateVote'
import VoterControls from './VoterControls'
import VoteResults from '@/components/voteresults/VoteResults'

import { SELECT_CANDIDATE } from '@/store/mutations'
const { VOTE_MODE_VIEWER, VOTE_MODE_STREAMER } = require('@shared/constants')

/**
 * Intended behavior:
 * -only works for supported games
 * -user submits vote
 * -vote ui reappears after the fade out (voter div still hidden)
 */

export default {
    name: 'voter',
    inheritAttrs: false,
    props:{
        candidates: Array,
        filteredCandidates: Array,
        whitelistedCandidates: Array
    },
    data () {
        return {
            CandidateVote
        }
    },
    computed:{
        ...Vuex.mapState(['selectedCandidate','voteMode']),
        ...Vuex.mapGetters(['hasSelectedCandidate','hasSubmittedVote']),
        showUI(){
            return !this.hasSubmittedVote
        },
        votableCandidates(){
            if(this.voteMode === VOTE_MODE_VIEWER)
                return this.candidates
            else if(this.voteMode === VOTE_MODE_STREAMER)
                return this.whitelistedCandidates
		},
		votableFilteredCandidates(){
			return _.intersectionBy(this.votableCandidates, this.filteredCandidates,'id')
		}
    },
    methods: {
        selectCandidate(candidate){
            const { name } = this.selectedCandidate
            const toSelect = name === candidate.name
                ? {} // Default value of no selection
                : candidate

            this.$store.commit(SELECT_CANDIDATE, toSelect)

            if (toSelect !== {}) {
                this.$emit('selectCandidate', toSelect)
            }
        },
    },
    components:{
        VoterHeader,
        CandidateGrid,
        VoterControls,
        VoteResults
    }
}

</script>

<style lang="scss" scoped>
.voter{
    display: grid;
    grid-template-columns: 1fr 300px;
    grid-template-rows: auto;
    grid-template-areas:
        "vote-form results";
    align-items: flex-start;
    justify-content: flex-end;
    grid-column-gap: $viewer-ui-gap;
    height: 100%;
    width: 100%;
    .vote-form{
        grid-area: vote-form;
        position: relative;
        padding: $viewer-ui-gap;
        max-height: 100%;
        min-height: 300px;
        min-width: 450px;
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: auto 1fr auto;
        grid-template-areas:
            "header"
            "main"
            "footer";
        grid-row-gap: $viewer-ui-gap;
        .candidate-grid{
            grid-area: main;
        }
    }
    //scroll topvotes when height overflow
    .vote-results{
        grid-area: results;
    }
}


</style>
