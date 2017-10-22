<template>
    <transition name="fade-vertical">
        <div v-show="showUI" class="voter overlay-background">
            <transition name="fade">
                <div v-show="splashTransition.isActive" class="splash-img-container">
                    <img class="splash-img" 
                        :class="splashTransition.class" 
                        :style="splashTransition.style" 
                        :src="selectedVote.imgSplash"
                    >    
                </div>
            </transition>
            <your-vote
                :hasSelectedVote="hasSelectedVote" 
                :selectedVote="selectedVote"
            ></your-vote>
            <image-grid 
                :heroes="heroes"
                :filteredHeroes="filteredHeroes"
                :splashTransition="splashTransition"
                @transition-done="stopSplashTransition"
            >
            </image-grid>
            <vote-controls class="vote-controls" :class="{ 'invisible': splashTransition.isActive }" :style="controlVisibilityDelay"
                :hasSelectedVote="hasSelectedVote" 
                :vote="selectedVote.name"
                @submit-vote="startSplashTransition"
            >
                <div class="field is-horizontal">
                    <div class="field-body">
                        <slot name="filters">
                        </slot>
                    </div>
                </div>
            </vote-controls> 
        </div>
    </transition>
</template>

<script>



import yourVote from './YourVote'
import imageGrid from './ImageGrid'
import voteControls from './voteControls'
import { GET_HEROES } from '@/store/actions'
import { NAMESPACE_DOTA } from '@/store/modules/dota'

function splashTransitionDefaults(){
    let duration = 4000
    return {
        isActive: false,
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
        controlVisibilityDelay(){
            return {
                'transition-delay': this.splashTransition.isActive ? '0s' : '1s'
            }
        },
        showUI(){
            return !this.hasSubmittedVote || this.splashTransition.isActive
        },
    },
    watch:{
        hasSubmittedVote(val){
            console.log('hass submit: ' + val)
            if(!val)
                this.splashTransition = splashTransitionDefaults()
        }
    },
    methods:{
        startSplashTransition(){
            this.splashTransition.isActive = true;
        },
        stopSplashTransition(){
            this.splashTransition.isActive = false;
        },
    },
    components:{
        yourVote,
        imageGrid,
        voteControls,
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
    .vote-controls{
        transition: .3s;
        &.invisible{
            opacity: 0;
        }
    }
    
}

.your-vote.shift-left {
    left: $shift-amount*1%;
    animation: shift-to-left 5s forwards;
}

</style>