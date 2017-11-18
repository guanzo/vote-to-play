<template>
    <div v-if="candidates.length" :class="game.className">
        <!-- <component :is="componentTest"></component> -->
        <voter :candidates="candidates" :filteredCandidates="filteredCandidates">
            <div v-if="game.filters" slot="filters">
                <template v-for="filter in game.filters">
                    <input v-if="filter.type == 'text'" 
                            v-model="filter.vmodel" 
                            :placeholder="filter.placeholder"
                            :key="filter.id"
                    >
                    <select v-else-if="filter.type == 'select'" 
                            v-model="filter.vmodel"
                            :key="filter.id">
                        <option v-for="role in filter.options" :key="role">{{ role }}</option>
                    </select>
                    &nbsp;
                </template>
            </div>
        </voter>
        <vote-results></vote-results>
    </div>
</template>

<script>

import voter from '@/components/viewer/voter/Voter'
import voteResults from '@/components/voteresults/VoteResults'
import { GET_CANDIDATES } from '@/store/actions'

/**
 * Generic component that serves all supported games.
 * 
 */

export default {
    name: 'game',
    data(){
        return {
            isLoading: false
        }
    },
    computed:{
        ...Vuex.mapState(['isAuthed']),
        ...Vuex.mapGetters({
            game: 'selectedGameModule'
        }),
        namespace(){
            return this.game.gameName
        },
        candidates(){
            return this.game.candidates
        },
        filteredCandidates(){
            let filtered = this.$store.getters[this.namespace+'/filteredCandidates']
            return filtered ? filtered : this.candidates
        }
    },
    watch:{
        isAuthed: {
            handler(){//dota needs to access server
                if(this.isAuthed)
                    this.fetchCandidates()
            },
            immediate: true
        },
        namespace(){
            this.fetchCandidates()
        }
    },
    created(){
        this.fetchCandidates()
    },
    methods:{
        async fetchCandidates(){
            if(!this.candidates.length && !this.isLoading){
                this.isLoading = true;
                await this.$store.dispatch(this.namespace+'/'+GET_CANDIDATES)
                this.isLoading = false
            }
        },
    },
    components:{
        voteResults,
        voter,
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
.heroes-of-the-storm{
    img {
        width: 100%;
        height: auto;
    }
    .image-wrapper{
        width: 45px;
        height: 45px;
    }
    
}
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
