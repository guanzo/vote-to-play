


import { SIMULATE_VOTE, START_NEW_VOTE } from '@/store/actions'
import { NAMESPACE as ALL_GAMES } from '@/store/modules/games/allGames'

export default {
    data(){
        return {
            intervalID: 0,
            maxSimulationVotes: 200,
            voteDelay: 150
        }
    },
    computed:{
        ...Vuex.mapState(['TESTING','currentVote']),
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
            let votes = this.maxSimulationVotes
            let candidatePool = Math.min(25, this.candidates.length);
            let intervalID = setInterval(()=>{
                let userId = this.randomIntFromInterval(0, 100000)
                let candidateIndex = this.randomIntFromInterval(0, candidatePool)

                if(userId == this.userId)
                    return;

                if(this.candidates.length == 0)
                    return;
                let candidateName = this.candidates[candidateIndex].name
                this.$store.dispatch(SIMULATE_VOTE, { vote: candidateName, userId  })
                
            },500)
            return intervalID
        },
        randomIntFromInterval(min,max){
            return Math.floor(Math.random()*(max-min+1)+min);
        }
    }
}