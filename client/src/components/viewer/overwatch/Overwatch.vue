<template>
    <div v-if="heroes.length" class="overwatch">
        <voter-section :heroes="heroes" :filteredHeroes="filteredHeroes">

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
        
        </voter-section>
        <vote-results :maxResults="maxResults"></vote-results>
    </div>
</template>

<script>

import _ from 'lodash'
import { mapState } from 'vuex'
import voterSection from '@/components/viewer/VoterSection'
import voteResults from '../voteresults/VoteResults'
import changeCase from 'change-case'

const DEFAULT_ROLE = 'Roles'

export default {
    name: 'overwatch',
    data(){
        return {
            query:'',
            DEFAULT_ROLE,
            selectedRole: DEFAULT_ROLE,
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
        filteredHeroes(){
            return this.heroes.filter(this.filterHero)
        }
    },
    methods:{
        filterHero(hero){
            let result = true;
            if(this.query.length)
                result = hero.name.toLowerCase().includes(this.query.toLowerCase())
            if(this.selectedRole != DEFAULT_ROLE)
                result = result && hero.type.toLowerCase().includes(this.selectedRole.toLowerCase())
            return result;
        },
    },
    components:{
        voteResults,
        voterSection
    }
}
</script>


<style lang="scss">

.overwatch{
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
