var Promise = require('bluebird');
var MongoClient = require('mongodb').MongoClient
, assert = require('assert');

// Connection URL
var productionUrl = 'mongodb://localhost:27017/votetoplay';

var state = {
    db: null,
}

exports.connect = function(url = productionUrl) {
    if (state.db) return Promise.resolve()

    return MongoClient.connect(url)
        .then(db=>{
            state.db = db
        })
        .catch((err)=>{
            console.log(err)
        })
}


exports.get = function() {
    return state.db
}

exports.close = function() {
    if (state.db) {
        return state.db.close()
            .then(()=>{
                state.db = null
                state.mode = null
            })
    }
}

