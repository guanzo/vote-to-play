<template>
    <div class="league-of-legends">
        <voter-section>
            <div slot="filters" class="field is-grouped">
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

            <div slot="image-grid-contents"
                v-for="champion in champions" 
                @click="selectChampion(champion)"
                class="image-wrapper" 
                :key="champion.id"
            >
                <img :class="{'filtered-out': !passesFilter(champion)}" :src="getChampionImage(champion.id)" :alt="champion.id">
            </div>

            <submit-vote-footer slot="submit-vote-footer" :hasSelectedVote="hasSelectedVote" :vote="selectedChampion.id">
                <div v-if="selectedChampion" class="flex-center">
                    <img :src="getChampionImage(selectedChampion.id)" :alt="selectedChampion.id">
                    &nbsp;
                    {{ selectedChampion.id }}
                </div>
            </submit-vote-footer>
        </voter-section>
        <vote-results :maxResults="maxResults">
            <template slot="vote" scope="props">
                <img :src="getChampionImage(props.obj.vote)" :alt="props.obj.vote">
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
import { NS_LOL } from '@/store/modules/lol'

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
        this.$store.dispatch(NS_LOL+'/'+GET_HEROES)
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
        submitVoteFooter,
        voterSection
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

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

</style>
