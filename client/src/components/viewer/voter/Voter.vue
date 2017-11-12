<template>
    <transition name="fade-vertical">
        <div v-show="showUI" class="voter overlay-background">
            <splash 
                :splashTransition="splashTransition" 
                :selectedVote="selectedVote"
            ></splash>
            <voter-header
                :hasSelectedVote="hasSelectedVote" 
                :selectedVote="selectedVote"
            ></voter-header>
            <image-grid 
                :heroes="heroes"
                :filteredHeroes="filteredHeroes"
                :splashTransition="splashTransition"
                @transition-done="stopSplashTransition"
            >
            </image-grid>
            <voter-controls
                :hasSelectedVote="hasSelectedVote" 
                :vote="selectedVote.name"
                :splashTransition="splashTransition"
                @submit-vote="startSplashTransition"
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
import { NAMESPACE_DOTA } from '@/store/modules/dota'

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
        class: Math.random() < 0.5 ? 'animate-to-left' : 'animate-to-right',
        style: { 'animation-duration': duration + 'ms' },
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
    },
    watch:{
        hasSubmittedVote(val){
            if(!val)
                this.splashTransition = splashTransitionDefaults()
        }
    },
    methods:{
        startSplashTransition(){
            this.splashTransition.isActive = true;
            this.splashTransition.hideVoteUI = true;
        },
        stopSplashTransition(){
            this.splashTransition.isActive = false;
        },
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
    
}

</style>