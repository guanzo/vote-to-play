<template>
    <div class="submit-vote-footer flex-center">
        <div class="your-vote">
            <div v-if="!hasSelectedVote" class="default-vote flex-center">
                <div class="image-placeholder flex-center">
                    &#63;
                </div>
                &nbsp;
                Your Vote
            </div>
            <div v-else class="flex-center">
                <div class="vote-image-wrapper flex-center">
                    <img :src="voteImage" :alt="vote">
                </div>
                <span>{{ vote }}</span>
            </div>
        </div>
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
import { VOTE, SIMULATE_VOTE, START_NEW_VOTE } from '@/store/actions'

export default {
    name: 'submit-vote-footer',
    props:['hasSelectedVote','vote','voteImage'],
    data(){
        return {
            buttonText: 'Vote',
            loading: false,
            //only set true when under twitch review.
            //only simulates dota heroes. so make sure dota is set in twitch dashbaord
            isSimulating: true,
            intervalID: 0,
            maxSimulationVotes: 200
        }
    },
    computed:{
        heroes(){
            return _.sortBy(this.$store.state.dota.heroes,'name')
        },
        userId(){
            return this.$store.state.userId
        },
        votes(){
            return this.$store.state.votes
        },
    },
    created(){
        
        if(this.isSimulating)
            this.intervalID = this.simulateVotes()
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
        }
    },
    methods:{
        submitVote(){
            this.loading = true;
            setTimeout(()=>{
                this.$store.dispatch(VOTE, { vote: this.vote, userId: this.userId })
                this.loading = false
            }, 750)
        },
        simulateVotes(){
            let votes = this.maxSimulationVotes
            let heroPool = 25;
            let intervalID = setInterval(()=>{
                let userId = this.randomIntFromInterval(0, 100000)
                let heroIndex = this.randomIntFromInterval(0, heroPool)
                if(userId == this.userId){
                    return;
                }
                if(this.heroes.length == 0)
                    return;
                let heroName = this.heroes[heroIndex].name
                //console.log(i)
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

<style lang="scss">

.dota .image-placeholder{
    width: 60px;
    height: 30px;
}

.overwatch .image-placeholder{
    width: 60px;
    height: 100px;
}

.league-of-legends .image-placeholder{
    width: 40px;
    height: 40px;
}
.hearthstone {
    .image-placeholder, .vote-image-wrapper{
        width: 100px;
        height: 160px;
    }
}
</style>

<style lang="scss" scoped>

.submit-vote-footer{
    margin-top: 20px;
    position: relative;
    .default-vote {
        .image-placeholder{
            background: #333;
        }
    }
    .your-vote {
        display: flex;
        font-size: 1.5em;
        color: white;
        text-shadow: #000 0px 0px 2px;
        .vote-image-wrapper{
            margin-right: 10px;
        }
    }
    .vote-button {
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
}
</style>