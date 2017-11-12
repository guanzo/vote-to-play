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


var self = module.exports = {
    //current vote is first element in "voteHistory"
    getCurrentVote(channelId){
        var channels = db.get().collection('channels')
        return channels.findOne({ channelId },{ voteHistory:{ $slice: 1 } })
                       .then(result=>{
                           //channel document may not exist, if streamer never pressed "start vote"
                           if(!result){
                               self.createChannel(channelId)
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

        channels.updateOne(
            { channelId },
            { 
                $push: { 
                    //prepend to array
                    voteHistory: { 
                        $each:[ createNewVote() ],
                        $position: 0
                    } 
                }
            },
        )
    },
    addVote({channelId, vote, userId, voteType = 'default'}) {
        var channels = db.get().collection('channels')
    
        /*
        user can only vote once

        "voteHistory.0.votes.userId": { $ne: userId }
        ^ query means iterate thru all objects in first element of voteHistory, 
        and make sure no userId's are equal to passed in userId

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
            
            { upsert: true }
        )
    },
    createChannel(channelId){
        var channel = {
            channelId,
            voteHistory: [ createNewVote() ],
            channelName: null
        }
        var channels = db.get().collection('channels')
        channels.insertOne(channel)
    }
}

function createNewVote(voteType = 'default'){
    var newVote = {
        _id: new ObjectID(),
        voteType,
        votes: [],
        createdAt: new Date()
    }
    return newVote;
}