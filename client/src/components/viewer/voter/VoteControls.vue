<template>
    <div class="vote-controls">
        <slot></slot><!-- spacing helper -->
        <button 
            @click="submitVote" 
            :disabled="!hasSelectedVote" 
            class="vote-button button"
            :class="{ 'is-loading': loading }"
        >
        {{ buttonText }}</button>
    </div>
</template>

<script>

import _ from 'lodash'
import { mapState, mapGetters } from 'vuex'
import { VOTE, SIMULATE_VOTE, START_NEW_VOTE } from '@/store/actions'

export default {
    name: 'vote-controls',
    props:['hasSelectedVote','vote','voteImage'],
    data(){
        return {
            loading: false,
            intervalID: 0,
            maxSimulationVotes: 200,
            voteDelay: 250
        }
    },
    computed:{
        ...mapState(['userId','votes','TESTING']),
        ...mapGetters(['getSelectedGameModule','hasSubmittedVote']),
        isSimulating(){
            return this.TESTING.isSimulating
        },
        heroes(){
            return _.sortBy(this.game.heroes,'name')
        },
        buttonText(){
            return this.hasSubmittedVote ? 'Success' : 'Vote'
        }
    },
    watch:{
        ['votes.length'](){
            if(!this.isSimulating)
                return;

            if(this.votes.length >= this.maxSimulationVotes){
                this.$store.dispatch(START_NEW_VOTE)
            }else if(this.votes.length == 0){
                clearInterval(this.intervalID)
                this.intervalID = this.simulateVotes()
            }
        },
        isSimulating(){
            if(this.isSimulating)
                this.intervalID = this.simulateVotes()
            else
                clearInterval(this.intervalID)
        }
    },
    methods:{
        submitVote(){
            this.loading = true;
            setTimeout(()=>{
                this.$store.dispatch(VOTE, { vote: this.vote, userId: this.userId })
                this.loading = false
            }, this.voteDelay)
        },
        simulateVotes(){
            let votes = this.maxSimulationVotes
            let heroPool = Math.min(25, this.heroes.length);
            let intervalID = setInterval(()=>{
                let userId = this.randomIntFromInterval(0, 100000)
                let heroIndex = this.randomIntFromInterval(0, heroPool)

                if(userId == this.userId)
                    return;

                if(this.heroes.length == 0)
                    return;
                let heroName = this.heroes[heroIndex].name
                this.$store.dispatch(SIMULATE_VOTE, { vote: heroName, userId  })
                
            },500)
            return intervalID
        },
        randomIntFromInterval(min,max){
            return Math.floor(Math.random()*(max-min+1)+min);
        }
    }
}

</script>

<style lang="scss" scoped>

.vote-controls{
    margin-top: 20px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>