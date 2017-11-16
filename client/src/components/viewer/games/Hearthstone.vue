<template>
    <div v-if="heroes.length" class="hearthstone">
        <hero-voter :candidates="heroes" :filteredCandidates="filteredHeroes"></hero-voter>
        <vote-results :maxResults="maxResults"></vote-results>
    </div>
</template>

<script>



import heroVoter from '@/components/viewer/voter/herovoter/HeroVoter'
import voteResults from '../voteresults/VoteResults'

const DEFAULT_ROLE = 'Roles'

export default {
    name: 'hearthstone',
    data(){
        return {
            query:'',
            DEFAULT_ROLE,
            selectedRole: DEFAULT_ROLE,
            maxResults: 3
        }
    },
    computed:{
        heroes(){
            return _.sortBy(this.$store.state.hearthstone.heroes,'name')
        },
    },
    components:{
        voteResults,
        heroVoter
    }
}
</script>


<style lang="scss">

//Hearthstone images do not have a common aspect ratio unlike the other games
//All images must be wrapped with an element with a set dimension, then resized using object-fit

.hearthstone{
    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
    }
    
    .image-wrapper {
        width: 75px;
        height: 120px;
    }
    .vote-results .image-wrapper {
        width: 38px;
        height: 60px;
    }
}


</style>
