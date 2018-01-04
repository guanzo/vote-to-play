<template>

<div class="vote-results">
    <div class="top-votes overlay-background" ref="topvotes">
        <transition name="fade">
            <div v-if="topAggregatedVotes.length" key="results" >
                <div class="is-size-5 has-text-centered">Results</div>
                <vote-table :votes="topAggregatedVotes" />
            </div>
            <div v-else class="no-results" key="noresults">
                <div>Waiting for votes...</div>
                <vote-loading />
            </div>
        </transition>
        
    </div>
    <transition name="fade-vertical">
        <div v-if="userVote" class="user-vote overlay-background">
            <div class="is-size-5 has-text-centered">Your Vote</div>
            <vote-table 
                v-if="userAggregatedVote.length" 
                :votes="userAggregatedVote"
            />
        </div>
    </transition>
</div>

</template>

<script>

import voteLoading from '@/components/util/loading/VoteLoading'
import loading from '@/components/util/loading/Loading'
import voteTable from './VoteTable'
import smoothHeight from 'vue-smooth-height'

export default {
    name: 'vote-results',
    mixins:[smoothHeight],
    computed:{
        ...Vuex.mapState(['currentVote']),
        ...Vuex.mapGetters(['userVote','selectedGameModule']),
        allAggregatedVotes(){
            return _(this.currentVote.votes)
                .countBy('vote')
                .map((count, vote)=> ({ vote, count }))
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
            return this.selectedGameModule.gameOptions.maxVoteResults
        },
        topAggregatedVotes(){
            return this.allAggregatedVotes.slice(0, this.maxResults)
        },
        userAggregatedVote(){
            return this.allAggregatedVotes.filter(vote=>vote.vote == this.userVote)
        }
    },
    mounted(){
        this.$registerElement({
            el: this.$refs.topvotes,
        })
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
    //transition: height 1s;
}


</style>