<template>

<div class="voter">
    <transition name="fade-vertical" @afterLeave="afterUiLeave">
        <div v-show="showUI" class="vote-form overlay-background">
            <Splash 
                :splashTransition="splashTransition" 
                :selectedCandidate="selectedCandidate"
                @transitionDone="endSplashTransition"
            ></Splash>
            <VoterHeader
                :hasSelectedCandidate="hasSelectedCandidate"
                :selectedCandidate="selectedCandidate"
                :class="isInvisible"
            ></VoterHeader>
            <CandidateGrid 
                v-bind="$attrs"
                :candidates="votableCandidates"
				:filteredCandidates="votableFilteredCandidates"
                :class="[isInvisible, 'candidate-grid light']"
            ></CandidateGrid>
            <VoterControls
                :hasSelectedCandidate="hasSelectedCandidate"
                :hasSubmittedVote="hasSubmittedVote"
                :vote="selectedCandidate.name"
                :class="isInvisible" 
                @submitVote="startSplashTransition"
            >
                <slot name="controls"></slot>
            </VoterControls> 
        </div>
    </transition>
    <VoteResults></VoteResults>
</div>

</template>

<script>

import Splash from './Splash'
import VoterHeader from './VoterHeader'
import CandidateGrid from '@/components/grid/CandidateGrid'
import VoterControls from './VoterControls'
import VoteResults from '@/components/voteresults/VoteResults'

var { VOTE_MODE_VIEWER, VOTE_MODE_STREAMER } = require('@shared/constants')

/**
 * Intended behavior:
 * -only works for supported games
 * -user submits vote
 * -vote ui disappears, splash art appears
 * -after duration, splash art && voter div fades out
 * -vote ui reappears after the fade out (voter div still hidden)
 */

export default {
    name: 'voter',
    inheritAttrs: false,
    props:['candidates','filteredCandidates','whitelistedCandidates'],
    data(){
        return {
            splashTransition: this.splashTransitionDefaults()
        }
    },
    computed:{
        ...Vuex.mapState(['selectedCandidate','voteMode']),
        ...Vuex.mapGetters(['hasSelectedCandidate','hasSubmittedVote']),
        showUI(){
            return !this.hasSubmittedVote || this.splashTransition.isActive
        },
        isInvisible(){
            return { 'invisible': this.splashTransition.hideVoteUI }
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
    watch:{
        hasSubmittedVote(hasSubmittedVote){
            if(!hasSubmittedVote)
                this.splashTransition = this.splashTransitionDefaults()
        },
        'splashTransition.splashImgIsLoaded'(isLoaded){
            if(isLoaded)
                this.splashTransition.hideVoteUI = true;
        }
	},
    methods:{
		//if candidate doesn't have imgSplash, skip transition all together
        startSplashTransition(){
            if(this.selectedCandidate.imgSplash)
                this.splashTransition.isActive = true;
        },
        endSplashTransition(){
            this.splashTransition.isActive = false
        },
        afterUiLeave(){
            //prevents vote ui appearing while ui is transitioning out
            this.splashTransition = this.splashTransitionDefaults()
        },
        splashTransitionDefaults(){
            let duration = 4000
            return {
                isActive: false,
                hideVoteUI: false,
                splashImgIsLoaded: false,
                splashClass: Math.random() < 0.5 ? 'animate-to-left' : 'animate-to-right',
                splashStyle: { 'animation-duration': duration + 'ms' },
                duration,
            }
        }
    },
    components:{
        Splash,
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
    .vote-results{
        margin-left: 15px;
    }
}


</style>