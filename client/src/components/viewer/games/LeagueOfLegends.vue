<template>
    <div v-if="candidates.length" class="league-of-legends">
        <voter :candidates="candidates" :filteredCandidates="filteredCandidates">
            
            <div slot="filters">
                <input v-model="query"placeholder="Search champion name">
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
import voteResults from '@/components/voteresults/VoteResults'
import { GET_CANDIDATES } from '@/store/actions'
import { NS_LOL } from '@/store/modules/games/lol'

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
        candidates(){
            return _.sortBy(this.$store.state.games.lol.candidates,'name')
        },
        roles(){
            return _(this.candidates).map(d=>d.tags).flatMap().uniq().sort().value()
        },
        filteredCandidates(){
            return this.candidates.filter(this.filterCandidate)
        }
    },
    created(){
        if(!this.candidates.length)
            this.$store.dispatch(NS_LOL+'/'+GET_CANDIDATES)
    },
    methods:{
        filterCandidate(candidate){
            let result = true;
            if(this.query.length)
                result = candidate.name.toLowerCase().includes(this.query.toLowerCase())
            if(this.selectedRole != DEFAULT_ROLE)
                result = result && candidate.tags.includes(this.selectedRole)
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
        width: 100%;
        height: auto;
    }
    .image-wrapper{
        width: 40px;
        height: 40px;
    }
}

</style>
