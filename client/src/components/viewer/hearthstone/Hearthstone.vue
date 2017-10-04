<template>
    <div v-if="heroes.length" class="hearthstone">
            <voter-section>
                <div slot="filters" class="field is-grouped">
                </div>

                <div slot="image-grid-contents"
                    v-for="hero in heroes" 
                    @click="selectVote(hero)"
                    class="image-wrapper" 
                    :key="hero.class"
                >
                    <img :class="{'filtered-out': !passesFilter(hero)}" :src="hero.img" :alt="hero.class">
                </div>
                
                <submit-vote-footer slot="submit-vote-footer" 
                    :hasSelectedVote="hasSelectedVote" 
                    :voteImage="selectedVote.img" 
                    :vote="selectedVote.class"
                >
                </submit-vote-footer>                
            </voter-section>
        <vote-results :maxResults="maxResults">
            <template slot="vote" scope="props">
                <div class="vote-item-image-wrapper">
                    <img :src="getHeroImage(props.obj.vote)" :alt="props.obj.vote">
                </div>
            </template>
        </vote-results>
    </div>
</template>

<script>

import axios from 'axios'
import _ from 'lodash'
import voterSection from '@/components/viewer/VoterSection'
import voteResults from '../VoteResults'
import submitVoteFooter from '../SubmitVoteFooter'
import isEmpty from 'lodash/isEmpty'

const DEFAULT_ROLE = 'Roles'

export default {
    name: 'hearthstone',
    data(){
        return {
            query:'',
            DEFAULT_ROLE,
            selectedRole: DEFAULT_ROLE,
            selectedVote: {},
            maxResults: 3
        }
    },
    computed:{
        heroes(){
            return _.sortBy(this.$store.state.hearthstone.heroes,'class')
        },
        hasSelectedVote(){
            return !isEmpty(this.selectedVote);
        },
    },
    methods:{
        passesFilter(hero){
            let result = true;
            if(this.query.length)
                result = hero.class.toLowerCase().includes(this.query.toLowerCase())
            if(this.selectedRole != DEFAULT_ROLE)
                result = result && hero.roles.includes(this.selectedRole)
            return result;
        },
        selectVote(vote){
            this.selectedVote = vote
        },
        getHeroImage(heroClass){//class is reserved word
            let hero = _.find(this.heroes,hero=>{
                return hero.class.toLowerCase() == heroClass.toLowerCase()
            })
            return hero.img
        }
    },
    components:{
        voteResults,
        submitVoteFooter,
        voterSection
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

//Hearthstone images do not have a common aspect ratio unlike the other games
//All images must be wrapped with an element with a set dimension, then resized using object-fit

.hearthstone{
	font-family: 'Cinzel', serif;
    color: #eee;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    width: 100%;
    .image-wrapper{
        margin: 3px;
    }
    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
    
    .submit-vote-image-placeholder, 
    .image-wrapper, 
    .submit-vote-image,
    .vote-item-image-wrapper{
        width: 100px;
        height: 160px;
    }
    
}


</style>
