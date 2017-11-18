<template>
    <div v-if="candidates.length" class="candidatees-of-the-storm">
        <voter :candidates="candidates" :filteredCandidates="filteredCandidates">
            
            <div slot="filters">
                <input v-model="query" placeholder="Search hero name">
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
import voteResults from '@/components/voteresults/VoteResults'
import { GET_CANDIDATES } from '@/store/actions'
import { NAMESPACE } from '@/store/modules/games/hots'

const DEFAULT_ROLE = 'Group'
const DEFAULT_SUBROLE = 'Subgroup'

export default {
    name: 'candidatees-of-the-storm',
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
        candidates(){
            return this.$store.state.games[NAMESPACE].candidates
        },
        roles(){
            return _(this.candidates).map(d=>d.Group).uniq().sort().value()
        },
        subroles(){
            return _(this.candidates).map(d=>d.SubGroup).uniq().sort().value()
        },
        filteredCandidates(){
            return this.candidates.filter(this.filterCandidate)
        }
    },
    created(){
        if(!this.candidates.length)
            this.$store.dispatch(NAMESPACE+'/'+GET_CANDIDATES)
    },
    methods:{
        filterCandidate(candidate){
            let result = true;
            if(this.query.length)
                result = candidate.name.toLowerCase().includes(this.query.toLowerCase())
            if(this.selectedRole != DEFAULT_ROLE)
                result = result && candidate.Group == this.selectedRole
            if(this.selectedSubrole != DEFAULT_SUBROLE)
                result = result && candidate.SubGroup == this.selectedSubrole
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

.candidatees-of-the-storm{
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
