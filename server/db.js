var Promise = require('bluebird');
var db = require('sqlite');

db.open('./votetoplay.sqlite')
    .then((arg)=>{

        db.run(`
            CREATE TABLE IF NOT EXISTS StreamerGames (channelId varchar(100), game varchar(50));
        `)
        console.log(db)
        db.run("INSERT INTO StreamerGames VALUES ('34256f4','dota')");
        db.run("INSERT INTO StreamerGames VALUES ('342e3235d56f4','lol')");
        

        db.all("SELECT * FROM StreamerGames")
            .then((...args)=>{
                console.log(args)
            })
    })


module.exports = {
    //set the game that the streamer is playing
    setStreamerGame(){

    }
}
