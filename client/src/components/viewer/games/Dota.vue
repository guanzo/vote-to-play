<template>
    <div class="dota">
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

import voter from '@/components/viewer/voter/Voter'
import voteResults from '@/components/voteresults/VoteResults'
import { GET_CANDIDATES } from '@/store/actions'
import { NAMESPACE } from '@/store/modules/games/dota'

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
        ...Vuex.mapState(['isAuthed']),
        candidates(){
            return this.$store.state.games[NAMESPACE].candidates
        },
        roles(){
            return _(this.candidates).map(d=>d.roles).flatMap().uniq().sort().value()
        },
        filteredCandidates(){
            return this.candidates.filter(this.filterCandidate)
        }
    },
    created(){
        console.log(this.$store)
    },
    watch:{
        isAuthed: {
            handler(){
                if(this.isAuthed && !this.candidates.length)
                    this.$store.dispatch(NAMESPACE+'/'+GET_CANDIDATES)
            },
            immediate: true
        }
    },
    methods:{
        filterCandidate(candidate){
            let result = true;
            if(this.query.length)
                result = candidate.name.toLowerCase().includes(this.query.toLowerCase())
            if(this.selectedRole != DEFAULT_ROLE)
                result = result && candidate.roles.includes(this.selectedRole)
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
    img {
        width: 100%;
        height: auto;
    }
    //59x33 is original size.
    .image-wrapper{
        width: 59px;
        height: 33px;
    }
}


</style>
