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
 *		              { vote: axe, userId: U4534434 }
 *		              { vote: mirana, userId: U456365 }
 *		           ]
 *              }
 *          ]
 *      },
 *      ...
 * ]
 *
 */

/**
 * current vote is first element in "voteHistory". It should
 * always exist. If a channel is created, start a vote.
 */
async function getChannel(channelId, channelName, game){
	var channels = db.get().collection('channels')

	//ensure channel document exists
	await addChannel(channelId, channelName, game)
	const channel = await channels.findOne(
		{ channelId },
		{
			whitelist: 1,
			hearthstoneDecks: 1,
			_id: 0
		}
	)
	return channel
}

async function getCurrentVote (channelId) {
	var channels = db.get().collection('channels')
	let currentVote = await channels.aggregate([
		{ $match: { channelId } },
		{
			$replaceRoot: {
				newRoot: {
					$arrayElemAt: ['$voteHistory', 0]
				}
			}
		},
		{
			$facet: {
				meta: [
					{
						$project: {
							id: 1,
							voteCategory: 1,
							voteMode: 1
						}
					}
				],
				votes: [
					{ $unwind: '$votes' },
					{ $sortByCount: "$votes.vote" },
					{
						$project: {
							_id: 0,
							vote: '$_id',
							count: 1
						}
					}
				]
			}
		},
		{
			$project: {
				voteId: { $arrayElemAt: ["$meta.id", 0] },
				voteMode: { $arrayElemAt: ["$meta.voteMode", 0] },
				voteCategory: { $arrayElemAt: ["$meta.voteCategory", 0] },
				votes: '$votes'
			}
		},
	]).toArray()

	// aggregate always returns array.
	currentVote = currentVote[0]
	return currentVote
}

async function startVote(channelId, voteCategory, voteMode){
	var channels = db.get().collection('channels')
	channels.createIndex({ channelId: 1 })

	const vote = createNewVoteObj(voteCategory, voteMode)
	await channels.updateOne(
		{ channelId },
		{
			$push: {
				//prepend to array
				voteHistory: {
					$each:[ vote ],
					$position: 0
				}
			}
		}
	)
	return vote.id
}

/*
user can only vote once

"voteHistory.0.votes.userId": { $ne: userId }
^ means check votes array in first element of voteHistory array
	unmatch if votes array contains userId

*/
function addVote(channelId, vote, userId) {
	var channels = db.get().collection('channels')
	return channels.updateOne(
		{ channelId, "voteHistory.0.votes.userId": { $ne: userId } },
		{
			$push: {
				'voteHistory.0.votes': {
					vote,
					userId
				}
			}
		},
	)
}

async function getUserVote (channelId, userId) {
	const channels = db.get().collection('channels')
	const results = await channels.aggregate([
		{ $match: { channelId } },
		{
			$replaceRoot: {
				newRoot: {
					$arrayElemAt: ['$voteHistory', 0]
				}
			}
		},
		{ $unwind: '$votes' },
		{
			$match: { 'votes.userId': userId }
		},
		{
			$replaceRoot: { newRoot: '$votes' }
		},

	]).toArray()

	if (results.length === 0) {
		return null
	} else {
		// aggregate always returns array.
		const userVote = results[0]
		return userVote.vote
	}
}

async function getWhitelist(channelId){
	var channels = db.get().collection('channels')
	const channel = await channels.findOne(
		{ channelId },
		{ whitelist: 1 , '_id': 0}
	)
	return channel.whitelist
}
//saves whitelist for a specific voteCategory
function saveGameWhitelist(channelId, gameWhitelist){
	var channels = db.get().collection('channels')
	let { voteCategory, names } = gameWhitelist

	let update = {
		$set: {
			[`whitelist.${voteCategory}`]: names
		}
	}
	return channels.updateOne({ channelId }, update)
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

function createNewVoteObj(voteCategory, voteMode = e.VOTE_MODE_VIEWER){
    return {
        id: new ObjectID(),
        voteCategory,
        voteMode,
        votes: [],
        createdAt: new Date()
    }
}

function addFakeVote(channelId, vote, userId) {
	var channels = db.get().collection('channels')
	return channels.updateOne(
		{ channelId },
		{
			$push: {
				'voteHistory.0.votes': {
					vote,
					userId
				}
			}
		},
	)
}

module.exports = {
	getChannel,
	getCurrentVote,
	startVote,
	addVote,
	getUserVote,
	getWhitelist,
	saveGameWhitelist,
	addFakeVote
}
