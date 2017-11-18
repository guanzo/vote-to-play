<template>
    <div v-if="candidates.length" class="hearthstone">
        <voter :candidates="candidates" :filteredCandidates="candidates"></voter>
        <vote-results :maxResults="maxResults"></vote-results>
    </div>
</template>

<script>



import voter from '@/components/viewer/voter/Voter'
import voteResults from '@/components/voteresults/VoteResults'
export default {
    name: 'hearthstone',
    data(){
        return {
            maxResults: 3
        }
    },
    computed:{
        candidates(){
            return _.sortBy(this.$store.state.hearthstone.candidates,'name')
        },
    },
    components:{
        voteResults,
        voter
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
    
    .voter-header .image-wrapper{
        width: 56px;
        height: 90px;
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
