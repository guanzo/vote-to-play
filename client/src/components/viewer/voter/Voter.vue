<template>
    <transition name="fade-vertical">
        <div v-show="showUI" class="voter overlay-background">
            <transition name="fade" @after-leave="afterSplashLeave">
                <div v-show="splashTransition.isActive" class="splash-img-container">
                    <img class="splash-img" 
                        :class="splashTransition.class" 
                        :style="splashTransition.style" 
                        :src="selectedVote.imgSplash"
                    >    
                </div>
            </transition>
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
        duration
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
        afterSplashLeave(){
            this.splashTransition.hideVoteUI = false;
        },
    },
    components:{
        voterHeader,
        imageGrid,
        voterControls,
    }
}

</script>

<style lang="scss">

$shift-amount: 5;

@keyframes shift-to-right{
    from { transform: translateX(0); }
    to {   transform: translateX($shift-amount * 1%); }
}
@keyframes shift-to-left{
    from { transform: translateX(0); }
    to {   transform: translateX($shift-amount * -1%); }
}

.voter{
    position: relative;
    padding: 15px;
    max-height: 100%;
    min-height: 450px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .splash-img-container {
        position: absolute;
        z-index: 0;
        overflow: hidden;
        width:100%;
        height:100%;
        top: 0;
        left: 0;
        img.splash-img{
            position: relative;
            object-fit: cover;
            width: (100 + $shift-amount) * 1% !important;
            max-width: (100 + $shift-amount) * 1% !important;
            height: 100%;
            max-height: 100% !important;
            &.animate-to-right{
                animation: shift-to-right forwards;
                right: $shift-amount * 1%;
            }
            &.animate-to-left{
                animation: shift-to-left forwards;
            }
        }
    }
    
}

</style>