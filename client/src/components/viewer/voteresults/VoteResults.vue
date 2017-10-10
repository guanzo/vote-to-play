<template>

<div class="vote-results">
    <div class="top-votes overlay-background" ref="topvotes">
        {{votes}}
        <transition name="fade">
            <div v-if="topAggregatedVotes.length"  key="results" >
                <h4 class="is-size-5"><b>Results</b></h4>
                <vote-table :votes="topAggregatedVotes"></vote-table>
            </div>
            <div v-else class="no-results" key="noresults">
                <div>Waiting for votes...</div>
                <br>
                <loading></loading>
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
import loading from '@/components/Loading'
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
        voteTable,
        loading
    }
}
</script>

<style lang="scss" scoped>

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

.no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    &.fade-leave-active {
        width: calc(100% - 30px);
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