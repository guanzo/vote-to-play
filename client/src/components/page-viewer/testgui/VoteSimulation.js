


import { VOTE, START_NEW_VOTE } from '@/store/actions'
import { NAMESPACE as ALL_GAMES } from '@/store/modules/games/allGames'
var { VOTE_MODE_VIEWER } = require('@shared/constants')

export default {
    data(){
        return {
            intervalID: 0,
            maxSimulationVotes: 200,
            voteDelay: 150
        }
    },
    computed:{
        ...Vuex.mapState(['TESTING','currentVote','voteMode']),
        votes(){
            return this.currentVote.votes;
        },
        game(){
            return this.$store.getters.selectedGameModule
        },
        isSimulating(){
            return this.TESTING.isSimulating
        },
        candidates(){
            return this.$store.getters[this.game.gameName+'/candidates']
        },
        whitelistedCandidates(){
            return this.$store.getters[this.game.gameName+'/whitelistedCandidates']
        },
        voteableCandidates(){
            if(this.voteMode == VOTE_MODE_VIEWER)
                return this.candidates
            else
                return this.whitelistedCandidates
        },
        isAllGames(){
            return this.game.gameName == ALL_GAMES
        },
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
        simulateVotes(){
            if(this.voteableCandidates.length == 0)
                return;

            let votes = this.maxSimulationVotes
            let candidatePool = Math.min(25, this.voteableCandidates.length);
            let intervalID = setInterval(()=>{

                let userId = this.randomIntFromInterval(0, 100000)
                let candidateIndex = this.randomIntFromInterval(0, candidatePool-1)
                let candidateName = this.voteableCandidates[candidateIndex].name
                this.$store.dispatch(VOTE, { vote: candidateName, userId  })
                
            },500)
            return intervalID
        },
        randomIntFromInterval(min,max){
            return Math.floor(Math.random()*(max-min+1)+min);
        }
    }
}