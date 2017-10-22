<template>
    <div v-if="heroes.length" class="dota">
        <voter :heroes="heroes" :filteredHeroes="filteredHeroes">

            <div slot="filters" class="field is-grouped is-grouped-multiline">
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
        </voter>
        <vote-results :maxResults="maxResults"></vote-results>
    </div>
</template>

<script>



import voter from '@/components/viewer/voter/Voter'
import voteResults from '../voteresults/VoteResults'
import { GET_HEROES } from '@/store/actions'
import { NAMESPACE_DOTA } from '@/store/modules/dota'

const DEFAULT_ROLE = 'Roles'

export default {
    name: 'dota',
    data(){
        return {
            query:'',
            DEFAULT_ROLE,
            selectedRole: DEFAULT_ROLE,
            maxResults: 5
        }
    },
    computed:{
        ...Vuex.mapState(['selectedGame','isAuthed']),
        heroes(){
            return _.sortBy(this.$store.state.dota.heroes,'name')
        },
        roles(){
            return _(this.heroes).map(hero=>hero.roles).flatMap().uniq().sort().value()
        },
        filteredHeroes(){
            return this.heroes.filter(this.filterHero)
        }
    },
    
    watch:{
        isAuthed: {
            handler(){
                if(this.isAuthed)
                    this.$store.dispatch(NAMESPACE_DOTA+'/'+GET_HEROES)
            },
            immediate: true
        }
    },
    methods:{
        filterHero(hero){
            let result = true;
            if(this.query.length)
                result = hero.name.toLowerCase().includes(this.query.toLowerCase())
            if(this.selectedRole != DEFAULT_ROLE)
                result = result && hero.roles.includes(this.selectedRole)
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

.dota{
    //59x33 is original size.
    .image-wrapper{
        width: 59px;
        height: 33px;
    }
    .image-grid .image-wrapper{
        margin: 2px;
    }
}


</style>
