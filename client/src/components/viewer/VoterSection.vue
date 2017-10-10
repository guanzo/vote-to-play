<template>
    <transition name="fade-vertical">
        <div v-if="!userSubmittedVote" class="voter-section overlay-background">
            <div class="filter-section field is-horizontal">
                <div class="field-body">
                    <slot name="filters">
                    </slot>
                </div>
            </div>

            <div class="image-grid">
                <div v-for="hero in heroes"
                    @click="selectVote(hero)"
                    class="image-wrapper" 
                    :key="hero.name"
                >
                    <img :class="filterClass(hero)" :src="hero.img" :alt="hero.name">
                </div>
            </div>

            <submit-vote-footer slot="submit-vote-footer" 
                :hasSelectedVote="hasSelectedVote" 
                :voteImage="selectedVote.img" 
                :vote="selectedVote.name"
            >
            </submit-vote-footer> 
        </div>
    </transition>
</template>

<script>


import axios from 'axios'
import _ from 'lodash'
import { mapState } from 'vuex'
import submitVoteFooter from './SubmitVoteFooter'
import isEmpty from 'lodash/isEmpty'
import { GET_HEROES } from '@/store/actions'
import { NAMESPACE_DOTA } from '@/store/modules/dota'

export default {
    name: 'voter-section',
    props:['heroes','filteredHeroes'],
    data(){
        return {
            selectedVote: {},
        }
    },
    computed:{
        game(){
            return this.$store.getters.getSelectedGameModule
        },
        userSubmittedVote(){
            return this.$store.getters.userSubmittedVote
        },
        hasSelectedVote(){
            return !isEmpty(this.selectedVote);
        },
        hasActiveFilter(){
            return this.filteredHeroes.length < this.heroes.length
        }
    },
    methods:{
        filterClass(hero){
            if(!this.hasActiveFilter)
                return ''
            return this.passesFilter(hero) ? 'filtered-in': 'filtered-out'
        },
        passesFilter(hero){
            return this.filteredHeroes.find(d=>d.name == hero.name)
        },
        selectVote(vote){
            this.selectedVote = vote
        },
    },
    components:{
        submitVoteFooter,
    }
}

</script>

<style lang="scss">

.voter-section{
    padding: 15px;
    max-height: 100%;
    display: flex;
    flex-direction: column;
     .image-grid{
        display: flex;
        flex-wrap: wrap;
        overflow: auto;
        
        .image-wrapper{
            margin: 2px;
            position: relative;
            transition: .3s all;
            cursor: pointer;
            &:hover:before {
                box-shadow: 0px 0px 0px 3px #eee inset;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                content: "";
            }
            img {
                display: block;
                transition: .3s all;
                &.filtered-out {
                    filter: brightness(20%);
                }
                &.filtered-in {
                    box-shadow: 0px 0px 2px 1px white;
                }
            }
        }
    }
    button{
        float: right;
    }
    .filter-section {
        min-height: 40px;
        margin-bottom: 5px;
    }
    
}

</style>