<template>
    <transition name="fade-vertical">
        <div v-show="showUI" class="voter overlay-background">
            <transition name="fade">
                <div v-if="!transitionState.showControls" class="splash-img-container">
                    <img class="splash-img" :src="selectedVote.imgSplash">    
                </div>
            </transition>
            <your-vote
                :hasSelectedVote="hasSelectedVote" 
                :selectedVote="selectedVote"
            ></your-vote>
            <image-grid 
                :heroes="heroes"
                :filteredHeroes="filteredHeroes"
                :transitionState="transitionState"
            >
            </image-grid>
            <vote-controls :class="{ 'invisible': !transitionState.showControls }" 
                :hasSelectedVote="hasSelectedVote" 
                :vote="selectedVote.name"
            >
                <div class="filter-section field is-horizontal">
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


import axios from 'axios'
import _ from 'lodash'
//import * as d3 from 'd3'
import { mapState } from 'vuex'
import yourVote from './YourVote'
import imageGrid from './ImageGrid'
import voteControls from './voteControls'
import { GET_HEROES } from '@/store/actions'
import { NAMESPACE_DOTA } from '@/store/modules/dota'

export default {
    name: 'voter',
    props:['heroes','filteredHeroes'],
    data(){
        return {
            transitionState: {
                showControls: true,
                isDone: false,
                splashArtDuration: 5000
            }
        }
    },
    computed:{
        selectedVote(){
            return this.$store.state.selectedVote
        },
        hasSelectedVote(){
            return this.$store.getters.hasSelectedVote
        },
        game(){
            return this.$store.getters.getSelectedGameModule
        },
        hasSubmittedVote(){
            return this.$store.getters.hasSubmittedVote
        },
        showUI(){
            return !this.hasSubmittedVote || !this.transitionState.isDone
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
    to {   transform: translateX($shift-amount*1%); }
}
@keyframes shift-to-left{
    from { transform: translateX(0); }
    to {   transform: translateX($shift-amount * -1%); }
}

.voter{
    position: relative;
    padding: 15px;
    max-height: 100%;
    display: flex;
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
            right: $shift-amount*1%;
            width: (100 + $shift-amount)*1% !important;
            max-width: (100 + $shift-amount)*1% !important;
            max-height: 100% !important;
            animation: shift-to-right 5s forwards;
        }
    }
    .invisible{
        transition: .3s;
        opacity: 0;
    }
    button{
        float: right;
    }
    .filter-section {
        min-height: 40px;
        margin-bottom: 5px;
    }
    
}


.your-vote.shift-left {
    left: $shift-amount*1%;
    animation: shift-to-left 5s forwards;
}

</style>