<template>
    <div class="dota">
        <transition name="fade-vertical">
            <div v-if="!userSubmittedVote" class="dota-heroes">
                <div class="field is-horizontal">
                    <div class="field-body">
                        <div class="field is-grouped">
                            <div class="control">
                                <input v-model="query" class="input" type="text" placeholder="Hero name">
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
                <div class="images">
                    <div 
                        v-for="hero in sortedHeroes" 
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
        <vote-results>
            <template slot="vote" scope="props">
                <div class="vote-item">
                    <span class="rank">{{ props.rank + "." }}</span>
                    <img :src="getHeroImage(props.obj.vote)">
                    {{ props.obj.vote }} 
                    <span class="count">{{ props.obj.count }}</span>
                </div>
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

const DEFAULT_ROLE = 'Roles'

export default {
    name: 'dota',
    data(){
        return {
            query:'',
            DEFAULT_ROLE,
            selectedRole: DEFAULT_ROLE,
            selectedHero: {}
        }
    },
    computed:{
        heroes(){
            return this.$store.state.dota.heroes
        },
        sortedHeroes(){
            return _.sortBy(this.heroes,'dname')
        },
        roles(){
            return _(this.heroes).map(hero=>hero.roles).flatMap().uniq().sort().value()
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

.dota-heroes{
    background: $overlay-background;
    padding: 10px;
    .images{
        display: flex;
        flex-wrap: wrap;
    }
    button{
        float: right;
    }
    
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

.submit-vote-footer{
    margin-top: 20px;
    padding: 5px;
    
    .default-vote {
        display: flex;
        .image-placeholder{
            background: grey;
            width: 60px;
            height: 30px;
        }
    }
    .your-vote {
        display: flex;
        margin-left: auto;
        font-size: 1.5em;
        color: white;
        text-shadow: #000 0px 0px 2px;
        span {
            margin-right: 10px;
        }
    }
    .vote-button {
        margin-left: auto;
    }
}

.vote-item{
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    .rank {
        width: 30px;
        text-align: center;
    }
    img {
        margin: 0px 10px;
    }
    .count {
        margin-left: auto;
    }
}

</style>
