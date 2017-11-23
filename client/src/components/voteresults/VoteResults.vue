<template>

<div class="vote-results">
    <div v-if="showStats" class="has-text-centered">
        <div v-show="votes.length">Total votes: {{ votes.length }}</div>
    </div>
    <div class="top-votes overlay-background" ref="topvotes">
        <transition name="fade">
            <div v-if="topAggregatedVotes.length"  key="results" >
                <div class="is-size-5 has-text-centered">Results</div>
                <vote-table :votes="topAggregatedVotes"></vote-table>
            </div>
            <div v-else class="no-results" key="noresults">
                <div>Waiting for votes...</div>
                <vote-loading></vote-loading>
            </div>
        </transition>
        
    </div>
    <transition name="fade-vertical">
        <div v-if="userVote" class="user-vote overlay-background">
            <div class="is-size-5 has-text-centered">Your Vote</div>
            <vote-table 
                v-if="userAggregatedVote.length" 
                :votes="userAggregatedVote"
            ></vote-table>
        </div>
    </transition>
</div>

</template>

<script>

import voteLoading from '@/components/loading/VoteLoading'
import loading from '@/components/loading/Loading'
import voteTable from './VoteTable'

export default {
    name: 'vote-results',
    props:{
        showStats: { default: false }
    },
    computed:{
        ...Vuex.mapState(['votes']),
        ...Vuex.mapGetters(['userVote','selectedGameModule']),
        allAggregatedVotes(){
            let totalVotes = this.votes.length;
            return _(this.votes)
                .countBy('vote')
                .map((count, vote)=> ({ vote, count, /* percent: Math.round((count/totalVotes)*100) */ }))
                .sortBy('count')
                .reverse()
                .map((vote,i)=>{
                    vote.rank = i + 1;
                    return vote;
                })
                .value()
        },
        maxResults(){
            if(!this.selectedGameModule)
                return 5;
            return this.selectedGameModule.maxVoteResults
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
        voteLoading,
        loading
    }
}
</script>

<style lang="scss" scoped>

.vote-results{
    flex: 0 0 350px;
    position: relative;
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