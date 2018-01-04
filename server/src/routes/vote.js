const voteModel = require('../models/vote')
const gameModel = require('../models/game')
const jwt = require('jsonwebtoken');
const e = require('../../../shared/socket-events')

function verifyToken(socket,next){
    
    var token = socket.handshake.query.token
    const secret = Buffer.from(process.env.TWITCH_EXTENSION_SECRET, 'base64');

    if(!token)
        return next(new Error('no token provided'));
    
    jwt.verify(token, secret, (err)=>{
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
        
        socket.on(e.CHANNELS_JOIN,async data=>{
            let { channelId } = data
            socket.join(channelId)
            let channel = await voteModel.getChannel(data)
            socket.emit(e.VOTES,channel.currentVote)
            socket.emit(e.WHITELIST,channel.whitelist)

            if(channel.hasOwnProperty('hearthstoneDecks'))
                socket.emit(e.HEARTHSTONE_DECKS,channel.hearthstoneDecks)
		})
		
        socket.on(e.VOTES_ADD,async data=>{
            let result = await voteModel.addVote(data)
            if(result.modifiedCount === 0)
                return;
            
            let { channelId, vote, userId } = data
            io.to(channelId).emit(e.VOTES_ADD, { vote, userId } )
        })
        
        if(query.role === 'broadcaster'){

            socket.on(e.VOTES_START,data=>{
                voteModel.startVote(data)
                io.to(data.channelId).emit(e.VOTES_START,data)
			})
			
            socket.on(e.WHITELIST_EDIT,async data=>{
                await voteModel.saveGameWhitelist(data)
                let whitelist = await voteModel.getEntireWhitelist(data.channelId)
                io.to(data.channelId).emit(e.WHITELIST,whitelist)
            })
            
            socket.on(e.HEARTHSTONE_DECKS_EDIT, async data=>{
                await gameModel.saveHearthstoneDecks(data)
                let decks = await gameModel.getHearthstoneDecks(data.channelId)
                io.to(data.channelId).emit(e.HEARTHSTONE_DECKS,decks)
            })

        }
    });

};