<template>
    <div v-if="candidates.length" class="overwatch">
        <voter :candidates="candidates" :filteredCandidates="filteredCandidates">

            <div slot="filters">
                <input v-model="query" placeholder="Search hero name">
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

import { NAMESPACE } from '@/store/modules/games/overwatch'
import voter from '@/components/viewer/voter/Voter'
import voteResults from '@/components/voteresults/VoteResults'

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
        candidates(){
            return this.$store.state.games[NAMESPACE].candidates
        },
        roles(){
            return _(this.candidates).map(d=>d.type).uniq().sort().value()
        },
        filteredCandidates(){
            return this.candidates.filter(this.filterCandidate)
        }
    },
    methods:{
        filterCandidate(candidate){
            let result = true;
            if(this.query.length)
                result = candidate.name.toLowerCase().includes(this.query.toLowerCase())
            if(this.selectedRole != DEFAULT_ROLE)
                result = result && candidate.type.toLowerCase().includes(this.selectedRole.toLowerCase())
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
