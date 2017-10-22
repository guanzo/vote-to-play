
/**
 * 
 * This extension will not persist any data. 
 * Votes are kept in memory until the streamer starts the next vote, in which case
 * all previous vote data for that streamer is overwritten.
 * 
 * Schema:
 * 
 * Votes = {
 *     Streamer1Id: {
 *          voteType: String
 *          votes: [
 *              { vote: String, userId: String }
 *          ]
 *     },
 *     singsing: {
 *          voteType: 'hero'
 *          votes: [
 *              { vote: axe, userId: U4534434 }
 *              { vote: mirana, userId: U456365 }
 *          ]
 *     }
 * 
 * } 
 * 
 */

const STORE = {}

//clear existing vote data
function startVote(channelId, voteType = 'default'){
    STORE[channelId] = {
        voteType,
        votes: []
    }
}

function postVote({channelId, userId, vote, voteType = 'default'}) {
    if(!STORE[channelId])
        startVote(channelId,voteType)

    let channel = STORE[channelId]
    
    if(process.env.NODE_ENV == 'development')
        channel.votes.push({ vote, userId })
    else if( !channel.votes.find(vote=>vote.userId == userId) )//user can only vote once.
        channel.votes.push({ vote, userId })

}



module.exports = (app,server) => {
    var io = require('socket.io')(server);
    
    io.on('connection', function (socket) {
        
        socket.on('join-channel',data=>{
            let { channelId } = data
            socket.join(channelId)
            
            //there is an ongoing vote, send entire vote data
            if(STORE[channelId])
                socket.emit(`all-votes`,STORE[channelId])
        })

        //only streamers can start a vote
        socket.on('start-vote',data=>{
            let { channelId } = data
            startVote(channelId, data.voteType)
            io.to(channelId).emit(`start-vote`,data)
        })

        socket.on('add-vote',data=>{
            postVote(data)
            let { channelId, vote, userId } = data
            io.to(channelId).emit(`add-vote`, { vote, userId } )
        })
        
        
    });

/*
    app.get('/vote/:channelId', (req, res) => {
        let channelId = req.params.channelId
        //console.log('get votes for channel: ' + channelId)
        res.json(STORE[channelId])
    });

    app.post('/vote/:channelId', (req, res) => {
        //console.log(req.body)
        let data = req.body
        let channelId = req.params.channelId
        postVote(channelId, data.userId, data.vote, data.voteType)
        res.status(200).end()
    });*/

};