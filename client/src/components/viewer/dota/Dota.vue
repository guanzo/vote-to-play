<template>
    <div class="dota">
        <div class="dota-heroes">
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
                    @click="selectedHero = hero"
                    class="image-wrapper" 
                    :key="hero.dname"
                >
                    <img :class="{'filtered-out': !passesFilter(hero)}" :src="hero.img">
                </div>
            </div>
            <div class="vote-bar flex-center">
                <div class="your-vote">
                    <div v-if="!selectedHero" class="default-vote">
                        <div class="image-placeholder flex-center">
                            <i class="fa fa-question-circle" aria-hidden="true"></i>
                        </div>
                        &nbsp;
                        No Vote Yet
                    </div>
                    <div v-else class="flex-center">
                        <img :src="selectedHero.img">
                        &nbsp;
                        {{ selectedHero.name }}
                    </div>
                </div>
                <button 
                    @click="vote()" 
                    :disabled="!selectedHero" 
                    class="vote-button button"
                >
                Vote</button>
            </div>
        </div>
        <vote-list></vote-list>
    </div>
</template>

<script>

import axios from 'axios'
import _ from 'lodash'
import {VOTE} from '@/store/actions'
import voteList from './VoteList'

const DEFAULT_ROLE = 'Roles'

export default {
    name: 'dota-heroes',
    data(){
        return {
            query:'',
            DEFAULT_ROLE,
            selectedRole: DEFAULT_ROLE,
            selectedHero: null
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
        vote(){
            this.$store.dispatch(VOTE, { vote: this.selectedHero.name })
        }
    },
    components:{
        voteList
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.dota{
	font-family: 'Cinzel', serif;
    color: #eee;
    display: flex;
}

.dota-heroes{
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

.vote-bar{
    margin-top: 20px;
    padding: 5px;
    .default-vote, .your-vote {
        padding: 5px;
        background: rgba(0,0,0,0.55);
    }
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

</style>
