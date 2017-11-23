var db = require('../db.js')
var ObjectID = require('mongodb').ObjectID
const e = require('../../../shared/constants')

/**
 * channels document collection
 * 
 * [
 *      {
 *          channelId: 2435333,
 *          channelName: 'guanzo',
 *          whitelist:{
 *              'Dota 2': ['axe', 'mirana'],
 *              ...
 *          },
 *          voteHistory: [
 *              {
 *                  voteCategory: 'Dota 2',
 *                  voteMode: 'default' or 'whitelist'
 *                  createdAt: '',
 *                  votes: [
        *              { vote: axe, userId: U4534434 }
        *              { vote: mirana, userId: U456365 }
        *           ]
 *              }
 *          ]
 *      },
 *      ...
 * ]
 * 
 * 
 */


module.exports = {
    /**
     * current vote is first element in "voteHistory". should always return a value
     * handles creation of channel if not exists
     */
    async getChannel({channelId, channelName, game}){
        var channels = db.get().collection('channels')
        
        //ensure channel document exists
        let result = await addChannel(channelId, channelName, game);
        return channels
                .findOne({ channelId },{ voteHistory:{ $slice: 1 } })
                .then(channel=>{
                    channel.currentVote = channel.voteHistory[0]
                    /** v1.4 COMPATIBILITY */
                    if(!channel.whitelist)
                        channel.whitelist = {}
                    delete channel.voteHistory
                    return channel
                })
                .catch(err=>{
                    console.log(err)
                })
    },
    startVote({channelId, voteCategory, voteMode}){
        var channels = db.get().collection('channels')
        channels.createIndex({ channelId: 1 })

        return channels.updateOne(
            { channelId },
            { 
                $push: { 
                    //prepend to array
                    voteHistory: { 
                        $each:[ createNewVoteObj(voteCategory, voteMode) ],
                        $position: 0
                    } 
                }
            }
        )
    },
    addVote({channelId, vote, userId, voteCategory}) {
        var channels = db.get().collection('channels')
    
        /*
        user can only vote once

        "voteHistory.0.votes.userId": { $ne: userId }
        ^ means check votes array in first element of voteHistory array
          unmatch if votes array contains userId

        */
        return channels.updateOne(
            { channelId, "voteHistory.0.votes.userId": { $ne: userId }  },
            { 
                $push: { 
                    'voteHistory.0.votes': { 
                        vote, 
                        userId
                    } 
                }
            },
        )
    },
    getEntireWhitelist(channelId){
        var channels = db.get().collection('channels')
        return channels.findOne({ channelId }, { whitelist: 1 , '_id': 0})
            .then(result=>{
                return result.whitelist
            })
    },
    //saves whitelist for a specific voteCategory
    saveGameWhitelist({channelId,gameWhitelist}){
        var channels = db.get().collection('channels')
        let { voteCategory, names } = gameWhitelist

        let upsert = {
            $set: { 
                [`whitelist.${voteCategory}`]: names
            },
            $setOnInsert: {
                whitelist:{
                    [voteCategory]: names
                }
            }
        }
        return channels.updateOne({ channelId }, upsert, { upsert: true })
    },
    async OLD_VERSION_getCurrentVote({channelId, channelName}){
        var channels = db.get().collection('channels')

        //ensure channel document exists
        let result = await OLD_VERSION_addChannelDocument(channelId, channelName);
        return channels
                .findOne({ channelId },{ voteHistory:{ $slice: 1 } })
                .then(result=>result.voteHistory[0])
                .catch(err=>{
                    console.log(err)
                })
    },
    OLD_VERSION_startVote({channelId, voteCategory}){
        var channels = db.get().collection('channels')
        channels.createIndex({ channelId: 1 })

        return channels.updateOne(
            { channelId },
            {
                $push: {
                    //prepend to array
                    voteHistory: {
                        $each:[ OLD_VERSION_createNewVoteObj(voteCategory) ],
                        $position: 0
                    }
                }
            }
        )
    },
    OLD_VERSION_addVote({channelId, vote, userId, voteCategory}) {
        var channels = db.get().collection('channels')

        /*
        user can only vote once

        "voteHistory.0.votes.userId": { $ne: userId }
        ^ means check votes array in first element of voteHistory array
          unmatch if votes array contains userId

        */
        return channels.updateOne(
            { channelId, "voteHistory.0.votes.userId": { $ne: userId }  },
            {
                $push: {
                    'voteHistory.0.votes': {
                        vote,
                        userId
                    }
                }
            },
        )
    },

}

function OLD_VERSION_addChannelDocument(channelId,channelName){
    var channel = {
        channelId,
        voteHistory: [ createNewVoteObj() ],//populate with an empty vote
    }
    //keep updating channelName in case it gets changed
    var channels = db.get().collection('channels')
    return channels.updateOne({channelId},{ $set:{ channelName }, $setOnInsert: channel }, { upsert: true })
}

function OLD_VERSION_createNewVoteObj(voteCategory){
    var newVote = {
        _id: new ObjectID(),
        voteCategory,
        votes: [],
        createdAt: new Date()
    }
    return newVote;
}

function addChannel(channelId,channelName, game){
    var channel = {
        channelId,
        whitelist:{},
        voteHistory: [ createNewVoteObj(game) ],//populate with an empty vote
    }
    //keep updating channelName in case it gets changed
    var channels = db.get().collection('channels')
    return channels.updateOne(
        {channelId},
        { $set:{ channelName }, $setOnInsert: channel }, 
        { upsert: true }
    )
}

function createNewVoteObj(voteCategory,voteMode = e.VOTE_MODE_VIEWER){
    var newVote = {
        _id: new ObjectID(),
        voteCategory,
        voteMode,
        votes: [],
        createdAt: new Date()
    }
    return newVote;
}