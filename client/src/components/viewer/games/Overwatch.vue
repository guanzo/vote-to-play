<template>
    <div v-if="heroes.length" class="overwatch">
        <voter :candidates="heroes" :filteredCandidates="filteredHeroes">

            <div slot="filters">
                <input v-model="query"placeholder="Search hero name">
                <select v-model="selectedRole">
                    <option>{{ DEFAULT_ROLE }}</option>
                    <option v-for="role in roles" :key="role">{{ role }}</option>
                </select>
            </div>
        
        </voter>
        <vote-results :maxResults="maxResults"></vote-results>
    </div>
</template>

<script>

import voter from '@/components/viewer/voter/Voter'
import voteResults from '../voteresults/VoteResults'

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
        heroes(){
            return _.sortBy(this.$store.state.overwatch.heroes,'name')
        },
        roles(){
            return _(this.heroes).map(hero=>hero.type).uniq().sort().value()
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
        voter
    }
}
</script>


<style lang="scss">

.overwatch{
    img {
        width: 100%;
        height: auto;
    }
    .image-wrapper{
        width: 58px;
        height: 100px;
    }
    .voter-header .image-wrapper{
        width: 43px;
        height: 75px;
    }
    .vote-results .image-wrapper {
        width: 29px;
        height: 50px;
    }
    select{
        text-transform: capitalize;
    }
}


</style>
