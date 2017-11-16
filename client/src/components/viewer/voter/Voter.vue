

<script>

import Splash from './Splash'
import VoterHeader from './VoterHeader'
import ImageGrid from './ImageGrid'
import VoterControls from './VoterControls'

/**
 * Intended behavior:
 * -only works for supported games
 * -user submits vote
 * -vote ui disappears, splash art appears
 * -after duration, splash art && voter div fades out
 * -vote ui reappears after the fade out (voter div still hidden)
 */
function splashTransitionDefaults(){
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

export default {
    name: 'voter',
    props:['candidates','filteredCandidates'],
    render(h){//using jsx in order to pass scoped slot from this parent to this child
        return (
            <transition name="fade-vertical" onAfterLeave={this.afterUiLeave}>
                <div v-show={this.showUI} class="voter overlay-background">
                    <Splash 
                        splashTransition={this.splashTransition} 
                        selectedCandidate={this.selectedCandidate}
                        onTransitionDone={this.endSplashTransition}
                    ></Splash>
                    <VoterHeader
                        hasSelectedCandidate={this.hasSelectedCandidate}
                        selectedCandidate={this.selectedCandidate}
                        class={this.invisible}
                    ></VoterHeader>
                    <ImageGrid 
                        candidates={this.candidates}
                        filteredCandidates={this.filteredCandidates}
                        class={this.invisible}
                        scopedSlots={this.$scopedSlots}
                    ></ImageGrid>
                    <VoterControls
                        hasSelectedCandidate={this.hasSelectedCandidate}
                        hasSubmittedVote={this.hasSubmittedVote}
                        vote={this.selectedCandidate.name}
                        onSubmitVote={this.startSplashTransition}
                        class={this.invisible} 
                    >
                    { this.$slots.filters }
                    </VoterControls> 
                </div>
            </transition>
        )
    },
    data(){
        return {
            splashTransition: splashTransitionDefaults()
        }
    },
    computed:{
        ...Vuex.mapState(['selectedCandidate']),
        ...Vuex.mapGetters(['hasSelectedCandidate','hasSubmittedVote']),
        showUI(){
            return !this.hasSubmittedVote || this.splashTransition.isActive
        },
        invisible(){
            return { 'invisible': this.splashTransition.hideVoteUI }
        }
    },
    watch:{
        hasSubmittedVote(val){
            if(!val)
                this.splashTransition = splashTransitionDefaults()
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
            this.splashTransition = splashTransitionDefaults()
        }
    },
}

</script>

<style lang="scss" scoped>

.voter{
    position: relative;
    padding: 15px;
    max-height: 100%;
    min-height: 300px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    
    .invisible{
        opacity: 0;
        pointer-events: none;
    }
}

</style>