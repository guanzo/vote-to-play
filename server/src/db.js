var Promise = require('bluebird')
var MongoClient = require('mongodb').MongoClient
var assert = require('assert')
var nodeCleanup = require('node-cleanup')

// Connection URL
var productionUrl = 'mongodb://localhost:27017/votetoplay'

var state = {
    db: null
}

module.exports.connect = function (url = productionUrl) {
    if (state.db) return Promise.resolve()

    return MongoClient.connect(url)
        .then(db => {
            state.db = db
        })
        .catch((err) => {
            // https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
            cl('\x1b[41m%s\x1b[0m', "CAN'T CONNECT TO MONGODB")
            cl(err)
        })
}

module.exports.get = function () {
    return state.db
}

module.exports.close = close

function close () {
    if (state.db) {
        return state.db.close()
            .then(() => {
                state.db = null
                state.mode = null
            })
    }
}

nodeCleanup(close)
