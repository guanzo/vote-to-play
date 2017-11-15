<template>
    <transition name="fade-vertical" @after-leave="afterUiLeave">
        <div v-show="showUI" class="voter overlay-background">
            <splash 
                :splashTransition="splashTransition" 
                :selectedCandidate="selectedCandidate"
                @transition-done="endSplashTransition"
            ></splash>
            <voter-header
                :hasSelectedCandidate="hasSelectedCandidate" 
                :selectedCandidate="selectedCandidate"
                 :class="invisible"
            ></voter-header>
            <image-grid 
                :candidates="candidates"
                :filteredCandidates="filteredCandidates"
                 :class="invisible"
            >
            </image-grid>
            <voter-controls
                :hasSelectedCandidate="hasSelectedCandidate" 
                :hasSubmittedVote="hasSubmittedVote"
                :vote="selectedCandidate.name"
                @submit-vote="startSplashTransition"
                 :class="invisible"
            >
                <slot name="filters"></slot>
            </voter-controls> 
        </div>
    </transition>
</template>

<script>

import splash from './Splash'
import voterHeader from './VoterHeader'
import imageGrid from './ImageGrid'
import voterControls from './voterControls'
import { NS_DOTA } from '@/store/modules/games/dota'

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
    components:{
        voterHeader,
        imageGrid,
        voterControls,
        splash
    }
}

</script>

<style lang="scss">


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