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
 *                  voteType: '',
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
    //current vote is first element in "voteHistory"
    getCurrentVote(channelId){
        var channels = db.get().collection('channels')
        return channels
                .findOne({ channelId },{ voteHistory:{ $slice: 1 } })
                .then(async result=>{
                    //channel document may not exist, if streamer never pressed "start vote"
                    if(!result){
                        await addChannelDocument(channelId)
                        return null
                    }
                    else
                        return result.voteHistory[0]
                })
                .catch(err=>{
                    console.log(err)
                })
    },
    startVote({channelId, channelName, voteType = 'default'}){
        var channels = db.get().collection('channels')
        channels.createIndex({ channelId: 1 })

        return channels.updateOne(
            { channelId },
            { 
                $set: {channelId, channelName},
                $push: { 
                    //prepend to array
                    voteHistory: { 
                        $each:[ createNewVoteObj() ],
                        $position: 0
                    } 
                }
            },
            { upsert: true }
        )
    },
    addVote({channelId, vote, userId, voteType = 'default'}) {
        var channels = db.get().collection('channels')
    
        /*
        user can only vote once

        "voteHistory.0.votes.userId": { $ne: userId }
        ^ means check votes array in first element of voteHistory array
          unmatch if votes array contains userId

        */
        channels.updateOne(
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


function addChannelDocument(channelId){
    var channel = {
        channelId,
        voteHistory: [ createNewVoteObj() ],//populate with an empty vote
        channelName: null
    }
    var channels = db.get().collection('channels')
    return channels.insertOne(channel)
}

function createNewVoteObj(voteType = 'default'){
    var newVote = {
        _id: new ObjectID(),
        voteType,
        votes: [],
        createdAt: new Date()
    }
    return newVote;
}