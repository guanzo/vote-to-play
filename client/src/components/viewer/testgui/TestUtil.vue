<template>
    <div v-if="IS_DEVELOPMENT" class="test-util">
        <select v-model="selectedGameVModel">
            <option v-for="game in games" :key="game">{{ game }}</option>
        </select>
        <div class="toggle-vote-simulation">
            Simulate Votes: {{isSimulating}}
            <input type="checkbox" v-model="isSimulating">
        </div>
        <button @click="resetVote">reset vote</button>
    </div>
</template>

<script>


import { TOGGLE_VOTE_SIMULATION, SET_GAME, SET_VOTE_CATEGORY } from '@/store/mutations'

import { START_NEW_VOTE } from '@/store/actions'
export default {
    name: 'test-util',
    data(){
        return {
            selectedGameModel: 'Dota 2'
        }
    },
    computed:{
        ...Vuex.mapState(['selectedGame','TESTING']),
        IS_DEVELOPMENT(){ return this.TESTING.IS_DEVELOPMENT },
        games(){
            return [...this.$store.getters.getSupportedGames, 'Unsupported']
        },
        isSimulating: {
            get () {
                return this.TESTING.isSimulating
            },
            set (value) {
                this.$store.commit(TOGGLE_VOTE_SIMULATION, value)
            }
        },
        selectedGameVModel: {
            get () {
                return this.$store.state.voteCategory
            },
            set (value) {
                this.$store.commit(SET_GAME, { game: value })
                this.$store.commit(SET_VOTE_CATEGORY, { voteCategory: value })
            }
        },
    },
    methods:{
        toggleVoteSimulation(){
            this.$store.commit(TOGGLE_VOTE_SIMULATION)
        },
        resetVote(){
            this.$store.dispatch(START_NEW_VOTE)
        }
    },
}
</script>



<style lang="scss" scoped>

.test-util{
    display: flex;
    > * {
        margin: 0px 5px;
    }
    .toggle-vote-simulation{
        background: grey;
        padding: 3px;
    }
}


</style>
