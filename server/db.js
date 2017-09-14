var Promise = require('bluebird');
var db = require('sqlite');

db.open('./votetoplay.sqlite')
    .then((arg)=>{
        db.run(`
            CREATE TABLE IF NOT EXISTS StreamerGames (channelId varchar(100) PRIMARY KEY, game varchar(50));
        `)
    })


module.exports = {
    //set the game that the streamer is playing
    getStreamerGame(channelId){
        return db.get(`SELECT game FROM StreamerGames WHERE channelId = $channelId`,{
            $channelId: channelId,
        })
    },
    setStreamerGame(channelId, game){
        return db.run(`INSERT OR REPLACE INTO StreamerGames VALUES ($channelId,$game)`,{
            $channelId: channelId,
            $game: game
        })
    }
}
