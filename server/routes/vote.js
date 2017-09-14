
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

function startVote(channelId, voteType){
    STORE[channelId] = {
        voteType,
        votes: []
    }
}

function postVote({channelId, userId, vote, voteType = 'default'}) {
    if(!STORE[channelId])
        startVote(channelId,voteType)

    let channel = STORE[channelId]
    if(!channel.votes.find(vote=>vote.userId == userId))
        channel.votes.push({ vote, userId })
    else
        console.log('already voted')

}


module.exports = (app,server) => {
    var io = require('socket.io')(server);
    
    io.on('connection', function (socket) {
        
        socket.on('start-vote',data=>{
            let { channelId } = data
            startVote(channelId, data.voteType)
            socket.emit(`start-vote:${channelId}`,data)
        })

        socket.on('vote',data=>{
            postVote(data)
            let { channelId } = data
            socket.emit(`vote:${channelId}`,STORE[channelId])
        })
        
        socket.on('select-game',data=>{
            let { channelId } = data
            socket.emit(`select-game:${channelId}`,data)
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