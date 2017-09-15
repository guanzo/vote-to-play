/**
 * Responsible for updating the hero data. Downloads json data from the web and saves as json file, which 
 * the frontend will request
 */

var Promise = require('bluebird');
var http = require('http');
var fs = require('fs');
var path = require('path')
var CronJob = require('cron').CronJob;

const fileOptions = {
    flags: 'a'
}

//check for updates every day
new CronJob('0 0 0 * * *', function() {
    console.log('cron executing at: ' + new Date());
    
    getLoLHeroes()

}, null, true, 'America/New_York');


function getLoLHeroes(){
    console.log('getting lol heroes')
    const jsonURL = process.env.LOL_HEROES_JSON_API
    var file = fs.createWriteStream(path.resolve(__dirname, 'json/lol_heroes.json'),fileOptions);
    var request = http.get(jsonURL, function(response) {
        response.pipe(file);
    });
}
