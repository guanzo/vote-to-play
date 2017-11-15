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
    async getCurrentVote({channelId, channelName}){
        var channels = db.get().collection('channels')

        //ensure channel document exists
        let result = await addChannelDocument(channelId, channelName);
        return channels
                .findOne({ channelId },{ voteHistory:{ $slice: 1 } })
                .then(result=>result.voteHistory[0])
                .catch(err=>{
                    console.log(err)
                })
    },
    startVote({channelId, voteType}){
        var channels = db.get().collection('channels')
        channels.createIndex({ channelId: 1 })

        return channels.updateOne(
            { channelId },
            { 
                $push: { 
                    //prepend to array
                    voteHistory: { 
                        $each:[ createNewVoteObj(voteType) ],
                        $position: 0
                    } 
                }
            }
        )
    },
    addVote({channelId, vote, userId, voteType}) {
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


function addChannelDocument(channelId,channelName){
    var channel = {
        channelId,
        channelName,
        voteHistory: [ createNewVoteObj() ],//populate with an empty vote
    }
    var channels = db.get().collection('channels')
    return channels.updateOne({channelId},{ $setOnInsert: channel }, { upsert: true })
}

function createNewVoteObj(voteType){
    var newVote = {
        _id: new ObjectID(),
        voteType,
        votes: [],
        createdAt: new Date()
    }
    return newVote;
}