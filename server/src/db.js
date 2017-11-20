var Promise = require('bluebird');
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var nodeCleanup = require('node-cleanup');

// Connection URL
var productionUrl = 'mongodb://localhost:27017/votetoplay';

var state = {
    db: null,
}
//var cleanup = require('./cleanup').Cleanup(); // will call noOp


exports.connect = function(url = productionUrl) {
    if (state.db) return Promise.resolve()

    return MongoClient.connect(url)
        .then(db=>{
            state.db = db
        })
        .catch((err)=>{
            console.log("CAN'T CONNECT TO MONGODB")
            console.log(err)
        })
}


exports.get = function() {
    return state.db
}

exports.close = close

function close() {
    console.log('CLOSING')
    if (state.db) {
        return state.db.close()
            .then(()=>{
                state.db = null
                state.mode = null
            })
    }
}

nodeCleanup(close);