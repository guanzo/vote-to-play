<template>
<div class="voter">
    <transition name="fade-vertical">
        <div v-show="showUI" class="vote-form overlay-background">
            <VoterHeader
                :hasSelectedCandidate="hasSelectedCandidate"
                :selectedCandidate="selectedCandidate"
                :class="isInvisible"
             />
            <CandidateGrid
                v-bind="$attrs"
                :candidates="votableCandidates"
				:filteredCandidates="votableFilteredCandidates"
                :class="[isInvisible, 'candidate-grid light']"
             />
            <VoterControls
                :hasSelectedCandidate="hasSelectedCandidate"
                :hasSubmittedVote="hasSubmittedVote"
                :vote="selectedCandidate.name"
                :class="isInvisible"
            >
                <slot name="controls" />
            </VoterControls>
        </div>
    </transition>
    <VoteResults />
</div>

</template>

<script>

import VoterHeader from './VoterHeader'
import CandidateGrid from '@/components/grid/CandidateGrid'
import VoterControls from './VoterControls'
import VoteResults from '@/components/voteresults/VoteResults'

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
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    height: 100%;
    width: 100%;
    .vote-form{
        position: relative;
        padding: 15px;
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
        grid-row-gap: 15px;
        .candidate-grid{
            grid-area: main;
        }
        .invisible{
            opacity: 0;
            pointer-events: none;
        }
    }
    //scroll topvotes when height overflow
    .vote-results{
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        max-height: 100%;
        /deep/ .top-votes {
            overflow-y: auto;
            > div {
                overflow: hidden;
            }
        }
    }
}


</style>
