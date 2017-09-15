/**
 * Makes api calls on behalf of browser, to circumvent cors
 */

const https = require('https');

function getDotaHeroes(res){
    https.get('https://www.dota2.com/jsfeed/heropickerdata',response=>{
        var body = '';
        response.on('data', d => {
            body += d;
        });
        response.on('end', ()=>{
            var data = JSON.parse(body);
            res.send(data)
        });
    })
}

module.exports = (app) => {

    app.get('/api/heroes/dota', (req, res) => {
        getDotaHeroes(res)
    })

}