<template>

<div class="vote-results">
    <div class="top-votes overlay-background" ref="topvotes">
        <h4 class="is-size-5"><b>Results</b></h4>
        <transition name="fade">
            <vote-table v-if="topAggregatedVotes.length" :votes="topAggregatedVotes"></vote-table>
            <div v-else style="width: 100%" class="has-text-centered">
                Waiting for votes...
            </div>
        </transition>
        
    </div>
    <transition name="fade-vertical">
        <div v-if="userVote" class="user-vote overlay-background">
            <h4 class="is-size-5"><b>Your Vote</b></h4>
            <vote-table v-if="userAggregatedVote.length" :votes="userAggregatedVote"></vote-table>
        </div>
    </transition>
</div>

</template>

<script>

import _ from 'lodash'
import voteTable from './VoteTable'
import { mapState, mapGetters } from 'vuex'

export default {
    name: 'vote-results',
    props:{
        maxResults: {
            type: Number,
            default: 5
        }
    },
    computed:{
        ...mapState(['votes']),
        ...mapGetters(['userVote']),
        allAggregatedVotes(){
            let totalVotes = this.votes.length;
            return _(this.votes)
                .countBy('vote')
                .map((count, vote)=> ({ vote, count, percent: Math.round((count/totalVotes)*100) }))
                .sortBy('count')
                .reverse()
                .map((vote,i)=>{
                    vote.rank = i + 1;
                    return vote;
                })
                .value()
        },
        topAggregatedVotes(){
            return this.allAggregatedVotes.slice(0, this.maxResults)
        },
        userAggregatedVote(){
            return this.allAggregatedVotes.filter(vote=>vote.vote == this.userVote)
        }
    },
    watch:{
        ['topAggregatedVotes.length'](newLength, oldLength){
            if(newLength != oldLength)
                this.animateHeight()
        }
    },
	methods:{
		animateHeight(){
			let el = this.$refs.topvotes
            let beforeHeight = el.clientHeight
            this.$nextTick(()=>{
                let afterHeight = el.clientHeight

                if(beforeHeight == 0 || afterHeight == 0)
                    return;

                el.style.height = beforeHeight+'px'
                el.offsetHeight//force reflow
                el.style.height = afterHeight+'px'
                el.addEventListener('transitionend',()=>{
                    el.style.height = 'auto'
                }, { once: true })
            })
		},
	},
    components:{
        voteTable
    }
}
</script>

<style lang="scss">

.vote-results{
    flex: 0 0 350px;
    position: relative;
    margin-left: 15px;
    //transition: 0.5s;
    //max-height: 100%;
    h4 {
        text-align: center;
        margin-bottom: 10px;
    }
    .fade-leave-active {
        position: absolute;
    }
}

.top-votes, .user-vote {
    padding: 15px;
}

.top-votes {
    position: relative;
    overflow: hidden;
    margin-bottom: 15px;
    transition: height 1s;
}


</style>