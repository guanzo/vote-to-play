var db = require('../db.js')
var ObjectID = require('mongodb').ObjectID

/**
 * channels document collection
 * 
 * [
 *      {
 *          channelId: int,
 *          channelName: string,
 *          voteHistory: [
 *              {
 *                  voteCategory: '',
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
     */
    async getCurrentVote({channelId, channelName, game}){
        var channels = db.get().collection('channels')
        
        //ensure channel document exists
        let result = await addChannelDocument(channelId, channelName, game);
        return channels
                .findOne({ channelId },{ voteHistory:{ $slice: 1 } })
                .then(result=>result.voteHistory[0])
                .catch(err=>{
                    console.log(err)
                })
    },
    startVote({channelId, voteCategory}){
        var channels = db.get().collection('channels')
        channels.createIndex({ channelId: 1 })

        return channels.updateOne(
            { channelId },
            { 
                $push: { 
                    //prepend to array
                    voteHistory: { 
                        $each:[ createNewVoteObj(voteCategory) ],
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
    getWhitelist(channelId){
        var channels = db.get().collection('channels')
        return channels.findOne({ channelId }, { whitelist: 1 , '_id': 0})
    },
    setWhitelist(channelId,whitelist){
        var channels = db.get().collection('channels')

    }
}


function addChannelDocument(channelId,channelName, game){
    var channel = {
        channelId,
        whitelist:{},
        voteHistory: [ createNewVoteObj(game) ],//populate with an empty vote
    }
    //keep updating channelName in case it gets changed
    var channels = db.get().collection('channels')
    return channels.updateOne({channelId},{ $set:{ channelName }, $setOnInsert: channel }, { upsert: true })
}

function createNewVoteObj(voteCategory){
    var newVote = {
        _id: new ObjectID(),
        voteCategory,
        votes: [],
        createdAt: new Date()
    }
    return newVote;
}