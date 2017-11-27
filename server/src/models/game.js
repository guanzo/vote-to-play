var db = require('../db.js')
var ObjectID = require('mongodb').ObjectID
const e = require('../../../shared/constants')

module.exports = {
    addHearthstoneDeck({channelId, deck}) {
        var channels = db.get().collection('channels')
        return channels.updateOne(
            { channelId },
            { 
                $push: { 
                    'hearthstoneDecks': deck
                }
            },
        )
    },
    getHearthstoneDecks(channelId) {
        var channels = db.get().collection('channels')
        return channels.findOne({ channelId },{ 'hearthstoneDecks': 1 , '_id': 0})
                .then(result=>{
                    return result.hearthstoneDecks
                })
    },
}
