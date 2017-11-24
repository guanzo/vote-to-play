import * as MUTATIONS from './mutations'
import * as ACTIONS from './actions'

import voteApi from '@/api/vote'


var { VOTE_MODE_VIEWER } = require('@shared/constants')
const IS_DEVELOPMENT = process.env.NODE_ENV == 'development'
const voteMode = VOTE_MODE_VIEWER
//potential values will be same as selectedGame, with the addition of "All Games"
const voteCategory = null,

export default {
    state:{
        //set by streamer's game set in dashboard
        selectedGame: null,
        voteCategory,
        voteMode,
        selectedCandidate:{},
        currentVote:{
            votes:[],
            voteCategory,
            voteMode,
            createdAt: null,
        },
        TESTING:{
            IS_DEVELOPMENT,
            isSimulating: false && IS_DEVELOPMENT,
            unlimitedVotes: false && IS_DEVELOPMENT
        }
    }
}