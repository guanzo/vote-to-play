<template>
    <div v-if="heroes.length" class="dota">
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
        <vote-results :maxResults="maxResults">
            <template slot="vote" scope="props">
                <img :src="getHeroImage(props.obj.vote)" :alt="props.obj.vote">
            </template>
        </vote-results>
    </div>
</template>

<script>

import axios from 'axios'
import _ from 'lodash'
import { mapState } from 'vuex'
import voterSection from '@/components/viewer/VoterSection'
import voteResults from '../VoteResults'
import submitVoteFooter from '../SubmitVoteFooter'
import isEmpty from 'lodash/isEmpty'
import { GET_HEROES } from '@/store/actions'
import { NS_DOTA } from '@/store/modules/dota'

const DEFAULT_ROLE = 'Roles'

export default {
    name: 'dota',
    data(){
        return {
            query:'',
            DEFAULT_ROLE,
            selectedRole: DEFAULT_ROLE,
            selectedVote: {},
            maxResults: 5
        }
    },
    computed:{
        ...mapState(['selectedGame','isAuthed']),
        heroes(){
            return _.sortBy(this.$store.state.dota.heroes,'name')
        },
        roles(){
            return _(this.heroes).map(hero=>hero.roles).flatMap().uniq().sort().value()
        },
        hasSelectedVote(){
            return !isEmpty(this.selectedVote);
        },
    },
    watch:{
        isAuthed: {
            handler(){
                if(this.isAuthed)
                    this.$store.dispatch(NS_DOTA+'/'+GET_HEROES)
            },
            immediate: true
        }
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

.dota{
	font-family: 'Cinzel', serif;
    color: #eee;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    width: 100%;
    
    //59x33 is original size.
    .submit-vote-image-placeholder, 
    .image-wrapper{
        width: 59px;
        height: 33px;
    }
}


</style>
