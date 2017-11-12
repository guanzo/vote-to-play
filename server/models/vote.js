var db = require('../db.js')
var ObjectID = require('mongodb').ObjectID

/**
 * 
 * 
 * Schema:
 * 
 * channels = [
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
 *      }
 * ]
 * 
 * 
 */

const IS_DEVELOPMENT = process.env.NODE_ENV != 'development'

var self = module.exports = {
    //current vote is first element in "voteHistory"
    getCurrentVote(channelId){
        var channels = db.get().collection('channels')
        return channels.findOne({ channelId },{ voteHistory:{ $slice: 1 } })
                       .then(result=>{
                           return !result ? null : result.voteHistory[0]
                       })
                       .catch(err=>{
                           console.log(err)
                       })
    },
    startVote({channelId, channelName, voteType = 'default'}){
        var channels = db.get().collection('channels')
        channels.ensureIndex('channelId')

        var newVote = {
            _id: new ObjectID(),
            voteType,
            votes: [],
            createdAt: new Date()
        }

        channels.updateOne(
            { channelId },
            { 
                $set: {channelId, channelName},
                $push: { 
                    //prepend to array
                    voteHistory: { 
                        $each:[newVote],
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
    }
}
