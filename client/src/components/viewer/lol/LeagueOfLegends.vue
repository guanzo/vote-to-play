<template>
    <div class="league-of-legends">
        <transition name="fade-vertical">
            <div v-if="!userSubmittedVote" class="lol-champions voter-section overlay-background">
                <div class="filter-section field is-horizontal">
                    <div class="field-body">
                        <div class="field is-grouped">
                            <div class="control">
                                <input v-model="query" class="input" type="text" placeholder="Search champion name">
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
                        v-for="champion in champions" 
                        @click="selectChampion(champion)"
                        class="image-wrapper" 
                        :key="champion.id"
                    >
                        <img :class="{'filtered-out': !passesFilter(champion)}" :src="getChampionImage(champion.id)">
                    </div>
                </div>
                <submit-vote-footer :hasSelectedVote="hasSelectedVote" :vote="selectedChampion.id">
                    <div v-if="selectedChampion" class="flex-center">
                        <img :src="getChampionImage(selectedChampion.id)">
                        &nbsp;
                        {{ selectedChampion.id }}
                    </div>
                </submit-vote-footer>
            </div>
        </transition>
        <vote-results :maxResults="maxResults">
            <template slot="vote" scope="props">
                <img :src="getChampionImage(props.obj.vote)">
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
import { GET_CHAMPIONS } from '@/store/actions'

const DEFAULT_ROLE = 'Roles'
const IMG_BASE_URL = 'https://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/'

export default {
    name: 'league-of-legends',
    data(){
        return {
            query:'',
            DEFAULT_ROLE,
            selectedRole: DEFAULT_ROLE,
            selectedChampion: {},
            maxResults: 10
        }
    },
    created(){
        this.$store.dispatch(GET_CHAMPIONS)
    },
    computed:{
        champions(){
            return _.sortBy(this.$store.state.lol.champions,'id')
        },
        roles(){
            return _(this.champions).map(champion=>champion.tags).flatMap().uniq().sort().value()
        },
        hasSelectedVote(){
            return !isEmpty(this.selectedChampion);
        },
        userSubmittedVote(){
            return this.$store.getters.userSubmittedVote
        }
    },
    methods:{
        passesFilter(champion){
            let result = true;
            if(this.query.length)
                result = champion.id.toLowerCase().includes(this.query.toLowerCase())
            if(this.selectedRole != DEFAULT_ROLE)
                result = result && champion.tags.includes(this.selectedRole)
            return result;
        },
        selectChampion(champion){
            this.selectedChampion = champion
        },
        getChampionImage(name){
            return IMG_BASE_URL + `${name}.png`
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

.league-of-legends{
	font-family: 'Cinzel', serif;
    color: #eee;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    width: 100%;
    img {
        max-height: 40px;
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


</style>
