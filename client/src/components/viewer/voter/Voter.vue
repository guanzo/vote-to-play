<template>
    <transition name="fade-vertical" @after-leave="afterUiLeave">
        <div v-show="showUI" class="voter overlay-background">
            <splash 
                :splashTransition="splashTransition" 
                :selectedVote="selectedVote"
                @transition-done="endSplashTransition"
            ></splash>
            <voter-header
                :hasSelectedVote="hasSelectedVote" 
                :selectedVote="selectedVote"
                 :class="invisible"
            ></voter-header>
            <image-grid 
                :heroes="heroes"
                :filteredHeroes="filteredHeroes"
                 :class="invisible"
            >
            </image-grid>
            <voter-controls
                :hasSelectedVote="hasSelectedVote" 
                :hasSubmittedVote="hasSubmittedVote"
                :vote="selectedVote.name"
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
import { GET_HEROES } from '@/store/actions'
import { NAMESPACE_DOTA } from '@/store/modules/games/dota'

/**
 * Intended behavior:
 * -user submits vote
 * -vote ui disappears, splash art appears
 * -after duration, splash art && voter div fades out
 * -after fade out, vote ui reappears
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
    props:['heroes','filteredHeroes'],
    data(){
        return {
            splashTransition: splashTransitionDefaults()
        }
    },
    computed:{
        ...Vuex.mapState(['selectedVote']),
        ...Vuex.mapGetters(['hasSelectedVote','hasSubmittedVote']),
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