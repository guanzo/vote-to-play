<template>
    <div v-if="heroes.length" class="heroes-of-the-storm">
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
                <div class="control">
                    <div class="select is-primary">
                    <select v-model="selectedSubrole">
                        <option>{{ DEFAULT_SUBROLE }}</option>
                        <option v-for="role in subroles" :key="role">{{ role }}</option>
                    </select>
                    </div>
                </div>
            </div>
        </voter-section>
        <vote-results :maxResults="maxResults"></vote-results>
    </div>
</template>

<script>

import axios from 'axios'
import _ from 'lodash'
import { mapState } from 'vuex'
import voterSection from '@/components/viewer/VoterSection'
import voteResults from '../voteresults/VoteResults'
import { GET_HEROES } from '@/store/actions'
import { NAMESPACE_HOTS } from '@/store/modules/hots'

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
        ...mapState(['selectedGame']),
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
        this.$store.dispatch(NAMESPACE_HOTS+'/'+GET_HEROES)
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
        voterSection
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

.heroes-of-the-storm{
    img {
        max-height: 45px;
    }
    .image-wrapper{
        width: 45px;
        height: 45px;
    }
    
}

</style>
