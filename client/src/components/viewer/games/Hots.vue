<template>
    <div v-if="heroes.length" class="heroes-of-the-storm">
        <voter :candidates="heroes" :filteredCandidates="filteredHeroes">
            
            <div slot="filters">
                <input v-model="query"placeholder="Search hero name">
                <select v-model="selectedRole">
                    <option>{{ DEFAULT_ROLE }}</option>
                    <option v-for="role in roles" :key="role">{{ role }}</option>
                </select>
                <select v-model="selectedSubrole">
                    <option>{{ DEFAULT_SUBROLE }}</option>
                    <option v-for="role in subroles" :key="role">{{ role }}</option>
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
import { NS_HOTS } from '@/store/modules/games/hots'

const DEFAULT_ROLE = 'Group'
const DEFAULT_SUBROLE = 'Subgroup'

export default {
    name: 'heroes-of-the-storm',
    data(){
        return {
            query:'',
            DEFAULT_ROLE,
            DEFAULT_SUBROLE,
            selectedRole: DEFAULT_ROLE,
            selectedSubrole: DEFAULT_SUBROLE,
            maxResults: 5
        }
    },
    computed:{
        heroes(){
            return _.sortBy(this.$store.state.hots.heroes,'name')
        },
        roles(){
            return _(this.heroes).map(hero=>hero.Group).uniq().sort().value()
        },
        subroles(){
            return _(this.heroes).map(hero=>hero.SubGroup).uniq().sort().value()
        },
        filteredHeroes(){
            return this.heroes.filter(this.filterHero)
        }
    },
    created(){
        if(!this.heroes.length)
            this.$store.dispatch(NS_HOTS+'/'+GET_HEROES)
    },
    methods:{
        filterHero(hero){
            let result = true;
            if(this.query.length)
                result = hero.name.toLowerCase().includes(this.query.toLowerCase())
            if(this.selectedRole != DEFAULT_ROLE)
                result = result && hero.Group == this.selectedRole
            if(this.selectedSubrole != DEFAULT_SUBROLE)
                result = result && hero.SubGroup == this.selectedSubrole
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

.heroes-of-the-storm{
    img {
        width: 100%;
        height: auto;
    }
    .image-wrapper{
        width: 45px;
        height: 45px;
    }
    
}

</style>
