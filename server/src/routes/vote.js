var model = require('../models/vote')
const jwt = require('jsonwebtoken');

function verifyToken(socket,next){
    var token = socket.handshake.query.token
    const secret = Buffer.from(process.env.TWITCH_EXTENSION_SECRET, 'base64');

    if(!token)
        return next(new Error('no token provided'));
    
    jwt.verify(token, secret, (err, decoded)=>{
        if (err)
            next(new Error('Failed to authenticate token.'));
        else 
            next();
        })
}

module.exports = (server) => {
    var io = require('socket.io')(server);

    //io.use(verifyToken)

    io.on('connection', async (socket)=>{
        
        /* var query = socket.handshake.query

        socket.join(query.channelId)

        let currentVote = await model.getCurrentVote(query);
        if(currentVote)
            socket.emit(`all-votes`,currentVote)
         */

        socket.on('join-channel',async data=>{
            let { channelId, channelName } = data
            socket.join(channelId)

            let currentVote = await model.getCurrentVote(data);
            if(currentVote)
                socket.emit(`all-votes`,currentVote)
        })
    

        socket.on('add-vote',async data=>{
            let result = await model.addVote(data)
            if(result.modifiedCount == 0)
                return;
            
            let { channelId, vote, userId } = data
            io.to(channelId).emit(`add-vote`, { vote, userId } )
        })
        
        if(query.role == 'broadcaster'){
            //only the streamer can start a vote
            socket.on('start-vote',data=>{
                model.startVote(data)
                io.to(data.channelId).emit(`start-vote`,data)
            })
        }
    });

};