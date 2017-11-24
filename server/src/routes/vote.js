var model = require('../models/vote')
const jwt = require('jsonwebtoken');
const e = require('../../../shared/socket-events')

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

    io.use(verifyToken)

    io.on('connection', async (socket)=>{
        
        var query = socket.handshake.query
        /** 1.5 events */
        socket.on(e.CHANNELS_JOIN,async data=>{
            let { channelId } = data
            socket.join(channelId)

            let channel = await model.getChannel(data)
            socket.emit(e.VOTES,channel.currentVote)
            socket.emit(e.WHITELIST,channel.whitelist)
        })
    
        socket.on(e.VOTES_ADD,async data=>{
            let result = await model.addVote(data)
            if(result.modifiedCount == 0)
                return;
            
            let { channelId, vote, userId } = data
            io.to(channelId).emit(e.VOTES_ADD, { vote, userId } )
        })
        
        if(query.role == 'broadcaster'){
            socket.on(e.VOTES_START,data=>{
                model.startVote(data)
                io.to(data.channelId).emit(e.VOTES_START,data)
            })

            socket.on(e.WHITELIST_EDIT,async data=>{
                await model.saveGameWhitelist(data)
                let whitelist = await model.getEntireWhitelist(data.channelId)
                io.to(data.channelId).emit(e.WHITELIST,whitelist)
            })
        }
    });

};