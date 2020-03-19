var expect = require('chai').expect
var voteModel = require('./vote-model')

var testUrl = 'mongodb://localhost:27017/votetoplaytest'

var db = require('../db.js')

describe('Vote', async () => {
    var channels
    var channelId = -1
    var channelName = 'guanzo'
    var game = 'Dota 2'
    var userId = -1

    before(async () => {
        await db.connect(testUrl)
        channels = db.get().collection('channels')
    })

    describe('getChannel', () => {
        describe("channel doesn't exist in db", () => {
            before(async () => {
                await channels.remove({})
            })
            it('returns new channel doc', async () => {
                const channel = await voteModel.getChannel(channelId, channelName, game)
                expect(channel).to.be.an('object')
                expect(channel.currentVote).to.be.an('object')
                expect(channel.currentVote.votes).to.be.an('array').that.is.empty
            })
            it('creates channel in db with default vote ', async () => {
                const channel = await channels.findOne({ channelId })
                expect(channel.channelId).to.equal(channelId)
                expect(channel.channelName).to.equal(channelName)
                expect(channel).to.have.property('voteHistory').that.is.an('array').to.have.lengthOf(1)
                expect(channel.voteHistory[0].voteCategory).to.equal(game)
                expect(channel.whitelist).to.be.an('object')
            })
        })

        describe('channel exists in db', () => {
            it('gets channel data', async () => {
                const channel = await voteModel.getChannel(channelId, channelName)
                expect(channel).to.have.property('currentVote').that.is.an('object')
                expect(channel).to.have.property('whitelist').that.is.an('object')
                expect(channel.currentVote).to.have.property('votes').that.is.an('array')
                expect(channel.currentVote).to.have.property('createdAt')
            })
        })
    })

    describe('startVote', () => {
        let originalLength
        before(async () => {
            const { voteHistory } = await channels.findOne({ channelId })
            originalLength = voteHistory.length
        })
        it('prepends a new vote instance to the voteHistory array', async () => {
            await voteModel.startVote({ channelId })
            const { voteHistory } = await channels.findOne({ channelId })

            expect(voteHistory).to.have.lengthOf(originalLength + 1)
            expect(voteHistory[0].createdAt).to.be.above(voteHistory[1].createdAt)
            expect(voteHistory[0].votes).to.have.lengthOf(0)
        })
    })

    describe('addVote', () => {
        const testAddVote = async () => {
            await voteModel.addVote({ channelId, vote: 'axe', userId })
            const channel = await voteModel.getChannel(channelId, channelName)
            expect(channel.currentVote.votes).to.have.lengthOf(1)
        }

        it('adds a vote to the most recent vote instance', testAddVote)
        it('prevents multiple votes from same user', testAddVote)
    })

    after(() => {
        db.close()
    })
})
