var model = require('../models/vote')



module.exports = (app,server) => {
    var io = require('socket.io')(server);
    
    io.on('connection', function (socket) {
        
        socket.on('join-channel',async data=>{
            let { channelId, channelName } = data
            socket.join(channelId)
            
            //there is an ongoing vote, send entire vote data
            let channelVote = await model.getCurrentVote(channelId);
            if(channelVote)
                socket.emit(`all-votes`,channelVote)
        })

        //only streamers can start a vote
        socket.on('start-vote',data=>{
            model.startVote(data)
            io.to(data.channelId).emit(`start-vote`,data)
        })

        socket.on('add-vote',data=>{
            model.addVote(data)
            let { channelId, vote, userId } = data
            io.to(channelId).emit(`add-vote`, { vote, userId } )
        })
        
        
    });

};