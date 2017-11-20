

<script>

import Splash from './Splash'
import VoterHeader from './VoterHeader'
import CandidateGrid from '@/components/CandidateGrid'
import VoterControls from './VoterControls'
import VoteResults from '@/components/voteresults/VoteResults'

import splashTransition from './SplashTransition'

export default {
    name: 'voter',
    props:['candidates','filteredCandidates'],
    render(h){//using jsx in order to pass scoped slot from this parent to this child
        return (
            <div class="voter">
                <transition name="fade-vertical" onAfterLeave={this.afterUiLeave}>
                    <div v-show={this.showUI} class="vote-form overlay-background">
                        <Splash 
                            splashTransition={this.splashTransition} 
                            selectedCandidate={this.selectedCandidate}

                            onTransitionDone={this.endSplashTransition}
                        ></Splash>
                        <VoterHeader
                            hasSelectedCandidate={this.hasSelectedCandidate}
                            selectedCandidate={this.selectedCandidate}
                            class={this.isInvisible}
                        ></VoterHeader>
                        <CandidateGrid 
                            candidates={this.candidates}
                            filteredCandidates={this.filteredCandidates}
                            class={[this.isInvisible, 'candidate-grid light']}
                            scopedSlots={this.$scopedSlots}
                        ></CandidateGrid>
                        <VoterControls
                            hasSelectedCandidate={this.hasSelectedCandidate}
                            hasSubmittedVote={this.hasSubmittedVote}
                            vote={this.selectedCandidate.name}
                            class={this.isInvisible} 

                            onSubmitVote={this.startSplashTransition}
                        >
                        { this.$slots.filters }
                        </VoterControls> 
                    </div>
                </transition>
                <VoteResults></VoteResults>
            </div>
        )
    },
    data: ()=>({ splashTransition: splashTransition() }),
    computed:{
        ...Vuex.mapState(['selectedCandidate']),
        ...Vuex.mapGetters(['hasSelectedCandidate','hasSubmittedVote']),
        showUI(){
            return !this.hasSubmittedVote || this.splashTransition.isActive
        },
        isInvisible(){
            return { 'invisible': this.splashTransition.hideVoteUI }
        }
    },
    watch:{
        hasSubmittedVote(val){
            if(!val)
                this.splashTransition = splashTransition()
        },
        'splashTransition.splashImgIsLoaded'(isLoaded){
            if(isLoaded)
                this.splashTransition.hideVoteUI = true;
        }
    },
    methods:{
        startSplashTransition(){
            if(this.selectedCandidate.imgSplash)
                this.splashTransition.isActive = true;
        },
        endSplashTransition(){
            this.splashTransition.isActive = false
        },
        afterUiLeave(){
            //prevents vote ui appearing while ui is transitioning out
            this.splashTransition = splashTransition()
        }
    },
}

</script>

<style lang="scss" scoped>

.voter{
    height: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    width: 100%;
    .vote-form{
        
        position: relative;
        padding: 15px;
        max-height: 100%;
        min-height: 300px;
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
}


</style>