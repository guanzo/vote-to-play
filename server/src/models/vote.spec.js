var expect = require("chai").expect;
var voteModule = require('./vote')

var testUrl = 'mongodb://localhost:27017/votetoplaytest'

var db = require('../db.js')

describe('Vote',async ()=>{
    var channels,
        channelId = -1,
        channelName = 'guanzo',
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
            it("returns empty array",async ()=>{
                let currentVote = await voteModule.getCurrentVote({channelId, channelName})
                expect(currentVote).to.be.an('object');
                expect(currentVote.votes).to.be.an('array').that.is.empty
            })
            it("creates channel in db",async ()=>{
                let channel = await channels.findOne({ channelId })
                expect(channel.channelId).to.equal(channelId)
                expect(channel.channelName).to.equal(channelName)
                expect(channel).to.have.property('voteHistory').that.is.an('array').to.have.lengthOf(1)
            })
    
        })

        describe('channel exists in db',()=>{
            it("gets current vote instance",async ()=>{
                let currentVote = await voteModule.getCurrentVote({channelId, channelName})
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

        let testAddVote = async ()=>{
            await voteModule.addVote({ channelId, vote: 'axe', userId })
            let currentVote = await voteModule.getCurrentVote({channelId, channelName})
            expect(currentVote.votes).to.have.lengthOf(1)
        }

        it('adds a vote to the most recent vote instance',testAddVote)
        it('prevents multiple votes from same user',testAddVote)
    });

    after(()=>{
        db.close()
    })
})