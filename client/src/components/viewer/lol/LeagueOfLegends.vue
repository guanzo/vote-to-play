<template>
    <div v-if="heroes.length" class="league-of-legends">
        <voter :heroes="heroes" :filteredHeroes="filteredHeroes">
            
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
        </voter>
        <vote-results :maxResults="maxResults"></vote-results>
    </div>
</template>

<script>

import _ from 'lodash'
import { mapState } from 'vuex'
import voter from '@/components/viewer/voter/Voter'
import voteResults from '../voteresults/VoteResults'
import { GET_HEROES } from '@/store/actions'
import { NAMESPACE_LOL } from '@/store/modules/lol'

const DEFAULT_ROLE = 'Roles'

export default {
    name: 'league-of-legends',
    data(){
        return {
            query:'',
            DEFAULT_ROLE,
            selectedRole: DEFAULT_ROLE,
            maxResults: 5
        }
    },
    computed:{
        ...mapState(['selectedGame']),
        heroes(){
            return _.sortBy(this.$store.state.lol.heroes,'name')
        },
        roles(){
            return _(this.heroes).map(hero=>hero.tags).flatMap().uniq().sort().value()
        },
        filteredHeroes(){
            return this.heroes.filter(this.filterHero)
        }
    },
    created(){
        this.$store.dispatch(NAMESPACE_LOL+'/'+GET_HEROES)
    },
    methods:{
        filterHero(hero){
            let result = true;
            if(this.query.length)
                result = hero.name.toLowerCase().includes(this.query.toLowerCase())
            if(this.selectedRole != DEFAULT_ROLE)
                result = result && hero.tags.includes(this.selectedRole)
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

.league-of-legends{
    img {
        max-height: 40px;
    }
    .image-wrapper{
        width: 40px;
        height: 40px;
    }
}

</style>
