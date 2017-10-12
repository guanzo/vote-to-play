<template>
    <div v-if="heroes.length" class="hearthstone">
        <voter :heroes="heroes" :filteredHeroes="heroes"></voter>
        <vote-results :maxResults="maxResults"></vote-results>
    </div>
</template>

<script>

import _ from 'lodash'
import { mapState } from 'vuex'
import voter from '@/components/viewer/voter/Voter'
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
        ...mapState(['selectedGame']),
        heroes(){
            return _.sortBy(this.$store.state.hearthstone.heroes,'name')
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
