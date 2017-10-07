<template>
    <div v-if="heroes.length" class="overwatch">
        <voter-section>

            <div slot="filters" class="field is-grouped">
                <div class="control">
                    <input v-model="query" class="input" type="text" placeholder="Search hero name">
                </div>
                <div class="control">
                    <div class="select is-primary">
                    <select v-model="selectedRole">
                        <option>{{ DEFAULT_ROLE }}</option>
                        <option v-for="role in roles" :key="role">{{ role }}</option>
                    </select>
                    </div>
                </div>
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
import changeCase from 'change-case'

const DEFAULT_ROLE = 'Roles'

export default {
    name: 'overwatch',
    data(){
        return {
            query:'',
            DEFAULT_ROLE,
            selectedRole: DEFAULT_ROLE,
            selectedVote: {},
            maxResults: 3,
        }
    },
    computed:{
        ...mapState(['selectedGame']),
        heroes(){
            return _.sortBy(this.$store.state.overwatch.heroes,'name')
        },
        roles(){
            return _(this.heroes).map(hero=>changeCase.title(hero.type)).uniq().sort().value()
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
                result = result && hero.type.toLowerCase().includes(this.selectedRole.toLowerCase())
            return result;
        },
        selectVote(vote){
            this.selectedVote = vote
        },
        getHeroImage(name){
            let hero = _.find(this.heroes,hero=>{
                return hero.name.toLowerCase() == name.toLowerCase()
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

.overwatch{
	font-family: 'Cinzel', serif;
    color: #eee;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    width: 100%;
    .image-grid .image-wrapper{
        margin: 3px;
    }
    img {
        max-height: 100px;
    }
    .image-wrapper{
        width: 58px;
        height: 100px;
    }
    .vote-results .image-wrapper {
        width: 29px;
        height: 50px;
    }
}


</style>
