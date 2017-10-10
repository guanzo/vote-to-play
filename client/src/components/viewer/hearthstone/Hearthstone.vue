<template>
    <div v-if="heroes.length" class="hearthstone">
            <voter-section>
                <div slot="filters" class="field is-grouped">
                </div>

                <div slot="image-grid-contents"
                    v-for="hero in heroes" 
                    @click="selectVote(hero)"
                    class="image-wrapper" 
                    :key="hero.name"
                >
                    <img :class="{'filtered-out': !passesFilter(hero)}" :src="hero.img" :alt="hero.name">
                </div>
                
                <submit-vote-footer slot="submit-vote-footer" 
                    :hasSelectedVote="hasSelectedVote" 
                    :voteImage="selectedVote.img" 
                    :vote="selectedVote.name"
                >
                </submit-vote-footer>                
            </voter-section>
        <vote-results :maxResults="maxResults"></vote-results>
    </div>
</template>

<script>

import axios from 'axios'
import _ from 'lodash'
import { mapState } from 'vuex'
import voterSection from '@/components/viewer/VoterSection'
import voteResults from '../voteresults/VoteResults'
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
        ...mapState(['selectedGame']),
        heroes(){
            return _.sortBy(this.$store.state.hearthstone.heroes,'name')
        },
        hasSelectedVote(){
            return !isEmpty(this.selectedVote);
        },
    },
    methods:{
        passesFilter(hero){
            let result = true;
            if(this.query.length)
                result = hero.name.toLowerCase().includes(this.query.toLowerCase())
            if(this.selectedRole != DEFAULT_ROLE)
                result = result && hero.roles.includes(this.selectedRole)
            return result;
        },
        selectVote(vote){
            this.selectedVote = vote
        },
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
    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
    
    .image-wrapper {
        width: 75px;
        height: 120px;
    }
    .vote-results .image-wrapper {
        width: 38px;
        height: 60px;
    }
}


</style>
