var db = require('../db.js')

module.exports = {
    saveHearthstoneDecks (channelId, decks) {
        var channels = db.get().collection('channels')
        return channels.updateOne(
            { channelId },
            { $set: { hearthstoneDecks: decks } }
        )
    },
    async getHearthstoneDecks (channelId) {
        var channels = db.get().collection('channels')
        const result = await channels.findOne(
            { channelId },
            { hearthstoneDecks: 1, _id: 0 }
        )
        return result.hearthstoneDecks
    }
}
