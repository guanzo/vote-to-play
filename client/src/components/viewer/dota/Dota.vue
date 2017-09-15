<template>
    <div class="dota">
        <transition name="fade-vertical">
            <div v-if="!userSubmittedVote" class="dota-heroes voter-section overlay-background">
                <div class="field is-horizontal">
                    <div class="field-body">
                        <div class="field is-grouped">
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
                    </div>
                </div>
                <div class="image-grid">
                    <div 
                        v-for="hero in heroes" 
                        @click="selectHero(hero)"
                        class="image-wrapper" 
                        :key="hero.dname"
                    >
                        <img :class="{'filtered-out': !passesFilter(hero)}" :src="hero.img">
                    </div>
                </div>
                <submit-vote-footer :hasSelectedVote="hasSelectedVote" :vote="selectedHero.name">
                    <div v-if="selectedHero" class="flex-center">
                        <img :src="selectedHero.img">
                        &nbsp;
                        {{ selectedHero.name }}
                    </div>
                </submit-vote-footer>
            </div>
        </transition>
        <vote-results :maxResults="maxResults">
            <template slot="vote" scope="props">
                <img :src="getHeroImage(props.obj.vote)">
            </template>
        </vote-results>
    </div>
</template>

<script>

import axios from 'axios'
import _ from 'lodash'
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
            return _.sortBy(this.$store.state.dota.heroes,'dname')
        },
        roles(){
            return _(this.heroes).map(hero=>hero.roles).flatMap().uniq().sort().value()
        },
        hasSelectedVote(){
            return !isEmpty(this.selectedHero);
        },
        userSubmittedVote(){
            return this.$store.getters.userSubmittedVote
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
    created(){
        
    },
    methods:{
        passesFilter(hero){
            let result = true;
            if(this.query.length)
                result = hero.dname.toLowerCase().includes(this.query.toLowerCase())
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
        submitVoteFooter
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



.image-wrapper{
    position: relative;
    transition: .3s all;
    cursor: pointer;
    &:before {
        box-shadow: 0px 0px 0px 0px $primary inset;
    }
    &:hover:before {
        box-shadow: 0px 0px 0px 3px #eee inset;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: "";
    }
    &:hover{
        box-shadow: 0px 0px 0px 3px $primary inset;
    }
    img {
        display: block;
        transition: .3s all;
        &.filtered-out {
            filter: brightness(20%);
        }
    }
}


</style>
