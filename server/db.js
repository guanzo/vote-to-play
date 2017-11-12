var Promise = require('bluebird');
var MongoClient = require('mongodb').MongoClient
, assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/votetoplay';

var state = {
    db: null,
}

exports.connect = function() {
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

exports.close = function(done) {
    if (state.db) {
        state.db.close(function(err, result) {
            state.db = null
            state.mode = null
            done(err)
        })
    }
}

