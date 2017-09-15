<template>
    <div class="overwatch">
        <transition name="fade-vertical">
            <div class="overwatch-heroes voter-section overlay-background">
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
                        :key="hero.name"
                    >
                        <img :class="{'filtered-out': !passesFilter(hero)}" :src="hero.avatar">
                    </div>
                </div>
                <submit-vote-footer :hasSelectedVote="hasSelectedVote" :vote="selectedHero.name">
                    <div v-if="selectedHero" class="flex-center">
                        <img :src="selectedHero.avatar">
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
import changeCase from 'change-case'

const DEFAULT_ROLE = 'Roles'

export default {
    name: 'overwatch',
    data(){
        return {
            query:'',
            DEFAULT_ROLE,
            selectedRole: DEFAULT_ROLE,
            selectedHero: {},
            maxResults: 3,
        }
    },
    computed:{
        heroes(){
            return _.sortBy(this.$store.state.ow.heroes,'name')
        },
        roles(){
            return _(this.heroes).map(hero=>changeCase.title(hero.type)).uniq().sort().value()
        },
        hasSelectedVote(){
            return !isEmpty(this.selectedHero);
        },
        userSubmittedVote(){
            return this.$store.getters.userSubmittedVote
        }
    },
    methods:{
        passesFilter(hero){
            let result = true;
            if(this.query.length)
                result = hero.name.toLowerCase().includes(this.query.toLowerCase())
            if(this.selectedRole != DEFAULT_ROLE)
                result = result && hero.type.includes(this.selectedRole)
            return result;
        },
        selectHero(hero){
            this.selectedHero = hero
        },
        getHeroImage(name){
            let hero = _.find(this.heroes,hero=>{
                return hero.name.toLowerCase() == name.toLowerCase()
            })
            return hero.avatar
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

.overwatch{
	font-family: 'Cinzel', serif;
    color: #eee;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    width: 100%;
    img {
        max-height: 100px;
    }
}

.image-wrapper{
    position: relative;
    transition: .3s all;
    margin: 3px;
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
        max-height: 100px;
        width: auto;
        display: block;
        transition: .3s all;
        &.filtered-out {
            filter: brightness(20%);
        }
    }
}

.submit-vote-img {
}

</style>
