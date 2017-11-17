<template>
    <div v-if="heroes.length" class="battlerite">
        <voter :candidates="heroes" :filteredCandidates="filteredHeroes">

            <div slot="filters">
                <input v-model="query" placeholder="Search champion name">
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
import { GET_HEROES } from '@/store/actions'
import { NS_BR } from '@/store/modules/games/battlerite'

const DEFAULT_ROLE = 'Class'

export default {
    name: 'battlerite',
    data(){
        return {
            query:'',
            DEFAULT_ROLE,
            selectedRole: DEFAULT_ROLE,
            maxResults: 5
        }
    },
    computed:{
        heroes(){
            return _.sortBy(this.$store.state.battlerite.heroes,'name')
        },
        roles(){
            return _(this.heroes).map(hero=>hero.class).uniq().sort().value()
        },
        filteredHeroes(){
            return this.heroes.filter(this.filterHero)
        }
    },
    created(){
        if(!this.heroes.length)
            this.$store.dispatch(NS_BR+'/'+GET_HEROES)
    },
    methods:{
        filterHero(hero){
            let result = true;
            if(this.query.length)
                result = hero.name.toLowerCase().includes(this.query.toLowerCase())
            if(this.selectedRole != DEFAULT_ROLE)
                result = result && hero.class == this.selectedRole
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

.battlerite{
    img {
        width: 100%;
        height: auto;
    }
    .image-wrapper{
        width: 125px;
        height: 68px;
    } 
    .splash-img-container img.splash-img{
        object-fit: contain;
    }
    select{
        text-transform: capitalize;
    }
}


</style>
