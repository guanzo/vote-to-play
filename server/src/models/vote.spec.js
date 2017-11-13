var expect = require("chai").expect;
var voteModule = require('./vote')

var testUrl = 'mongodb://localhost:27017/testvotetoplay'

var db = require('../db.js')

describe('Vote',async ()=>{
    var channels,
        channelId = -1,
        userId = -1

    before(async ()=>{
        await db.connect(testUrl)
        channels = db.get().collection('channels')
    })
    
    describe("getCurrentVote", ()=>{
        describe("channel doesn't exist in db",()=>{
            before(async ()=>{
                await channels.remove({})
            })
            it("returns null",async ()=>{
                let currentVote = await voteModule.getCurrentVote(channelId)
                expect(currentVote).to.be.null
            })
            it("creates channel in db",async ()=>{
                let channel = await channels.findOne({ channelId })
                expect(channel.channelId).to.equal(channelId)
                expect(channel).to.have.property('voteHistory').that.is.an('array').that.is.not.empty;
                expect(channel.voteHistory).to.be
            })
    
        })
        describe('channel exists in db',()=>{
            it("gets current vote instance",async ()=>{
                let currentVote = await voteModule.getCurrentVote(channelId)
                expect(currentVote).to.have.property('votes').that.is.an('array')
                expect(currentVote).to.have.property('createdAt')
            })
        })
    });
    
    describe("startVote", ()=>{
        let originalLength;
        before(async ()=>{
            let { voteHistory } = await channels.findOne({ channelId })
            originalLength = voteHistory.length
        })
        it('prepends a new vote instance to the voteHistory array',async ()=>{
            await voteModule.startVote({ channelId })
            let { voteHistory } = await channels.findOne({ channelId })
            
            expect(voteHistory).to.have.lengthOf(originalLength + 1)
            expect(voteHistory[0].createdAt).to.be.above(voteHistory[1].createdAt)
            expect(voteHistory[0].votes).to.have.lengthOf(0)
        })
    });

    describe("addVote", ()=>{
        let vote = 'axe';
        it('adds a vote to the most recent vote instance',async ()=>{
            await voteModule.addVote({ channelId, vote, userId })
            let currentVote = await voteModule.getCurrentVote(channelId)
            expect(currentVote.votes).to.have.lengthOf(1)
        })
        it('prevents multiple votes from same user',async ()=>{
            await voteModule.addVote({ channelId, vote, userId })
            let currentVote = await voteModule.getCurrentVote(channelId)
            expect(currentVote.votes).to.have.lengthOf(1)
        })
    });

    after(()=>{
        db.close()
    })
})