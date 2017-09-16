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
                    @click="selectHero(hero)"
                    class="image-wrapper" 
                    :key="hero.name"
                >
                    <img :class="{'filtered-out': !passesFilter(hero)}" :src="hero.img" :alt="hero.name">
                </div>
                
                <submit-vote-footer slot="submit-vote-footer" :hasSelectedVote="hasSelectedVote" :vote="selectedHero.name">
                    <div v-if="selectedHero" class="flex-center">
                        <img :src="selectedHero.img" :alt="selectedHero.name">
                        &nbsp;
                        {{ selectedHero.name }}
                    </div>
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
            selectedHero: {},
            maxResults: 10
        }
    },
    computed:{
        heroes(){
            return _.sortBy(this.$store.state.dota.heroes,'name')
        },
        roles(){
            return _(this.heroes).map(hero=>hero.roles).flatMap().uniq().sort().value()
        },
        hasSelectedVote(){
            return !isEmpty(this.selectedHero);
        },
        isAuthed(){
            return this.$store.state.isAuthed;
        }
    },
    watch:{
        isAuthed(){
            if(this.isAuthed)
                this.$store.dispatch(NS_DOTA+'/'+GET_HEROES)
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
        selectHero(hero){
            this.selectedHero = hero
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
<style lang="scss" scoped>

.dota{
	font-family: 'Cinzel', serif;
    color: #eee;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    width: 100%;
}


</style>
