var db = require('../db.js')
const axios = require('axios')

module.exports = {
    saveHearthstoneDecks({channelId, decks}) {
        var channels = db.get().collection('channels')
        return channels.updateOne({ channelId },{ $set: { hearthstoneDecks: decks} })
    },
    getHearthstoneDecks(channelId) {
        var channels = db.get().collection('channels')
        return channels.findOne({ channelId },{ 'hearthstoneDecks': 1 , '_id': 0})
                .then(result=>{
                    return result.hearthstoneDecks
                })
	},
	async fixAllGames(){
		console.log('fixing all games')
		var channels = db.get().collection('channels')
		var channelsToFix = await channels.find(
			{ 'whitelist.All Games':{ $elemMatch:{ id:{ $exists: false } } } },
			{ channelId: 1, 'whitelist.All Games': 1 }
		).toArray()
		console.log('channels that need fix: ' + channelsToFix.length)
		if(channelsToFix.length === 0){
			console.log('nothing to fix')
			return;
		}
		var namesThatNeedIDs = [];

		channelsToFix.forEach(({ whitelist })=>{
			let allGames = whitelist['All Games']
			namesThatNeedIDs.push(...allGames.map(d=>d.name))
		})
		var uniqueNames = Array.from(new Set(namesThatNeedIDs))
		var promises = []
		var i,j,temparray,chunk = 100;
		for (i=0,j=uniqueNames.length; i<j; i+=chunk) {
			temparray = uniqueNames.slice(i,i+chunk);
			promises.push(getGamesByName(temparray))
		}

		let result = await Promise.all(promises)
		let games = []
		result.forEach(res=>games.push(...res.data.data))

		let nameIdMap = {}
		games.forEach(game=>{
			nameIdMap[game.name] = game.id
		})
		
		channelsToFix.forEach(({ channelId, whitelist })=>{
			let allGames = whitelist['All Games']
			allGames.forEach(game=>{
				game.id = nameIdMap[game.name]
			})
			channels.updateOne({ channelId },{ $set:{ 'whitelist.All Games': allGames } })
		})

	}
}


function getGamesByName(names){
	const clientId = '0ms0a4rmjh6b7beixaqndrefsz1dfy';
	let param = names.map(name=>{
		return 'name='+encodeURIComponent(name)+'&'
	}).join('')
	return axios.get(`https://api.twitch.tv/helix/games?${param}`,{
		headers:{
			'Client-ID':clientId
		}
	})
	.catch(err=>{
		console.log(err)
	})
}
