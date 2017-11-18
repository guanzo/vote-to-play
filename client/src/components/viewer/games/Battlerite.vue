<template>
    <div v-if="candidates.length" class="battlerite">
        <voter :candidates="candidates" :filteredCandidates="filteredCandidates">

            <div slot="filters">
                <input v-model="query" placeholder="Search champion name">
                <select v-model="selectedRole">
                    <option>{{ DEFAULT_ROLE }}</option>
                    <option v-for="role in roles" :key="role">{{ role }}</option>
                </select>
            </div>
        </voter>
        <vote-results></vote-results>
    </div>
</template>

<script>

import voter from '@/components/viewer/voter/Voter'
import voteResults from '@/components/voteresults/VoteResults'
import { GET_CANDIDATES } from '@/store/actions'
import { NAMESPACE } from '@/store/modules/games/battlerite'

const DEFAULT_ROLE = 'Class'

export default {
    name: 'battlerite',
    data(){
        return {
            query:'',
            DEFAULT_ROLE,
            selectedRole: DEFAULT_ROLE,
        }
    },
    computed:{
        candidates(){
            return this.$store.state.games[NAMESPACE].candidates
        },
        roles(){
            return _(this.candidates).map(d=>d.class).uniq().sort().value()
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
                result = result && candidate.class == this.selectedRole
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
    
    .vote-results .image-wrapper {
        width: 62px;
        height: 34px;
    }
    .splash-img-container img.splash-img{
        object-fit: contain;
    }

    select{
        text-transform: capitalize;
    }
}


</style>
