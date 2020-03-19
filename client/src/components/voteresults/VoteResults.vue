<template>
<div class="vote-results viewer-ui-block">
    <transition name="fade">
        <div v-if="topAggregatedVotes.length" class="top-results" key="results">
            <div class="info-bar">
                Total votes: {{ totalVotes }}
            </div>
            <vote-table :votes="topAggregatedVotes" />
            <div class="action-bar">
                <a
                    v-if="showToggleVotesBtn"
                    @click="toggleSeeAllVotes"
                    class="toggle-votes-list">
                    {{ seeAllVotes ? 'View top votes' : 'View all votes' }}
                </a>
            </div>
        </div>
        <div v-else class="no-results" key="noresults">
            <div>Waiting for votes...</div>
            <vote-loading />
        </div>
    </transition>
</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

import voteLoading from '@/components/util/loading/VoteLoading'
import loading from '@/components/util/loading/Loading'
import voteTable from './VoteTable'
import smoothReflow from 'vue-smooth-reflow'

export default {
    name: 'vote-results',
    mixins:[smoothReflow],
    data () {
        return {
            seeAllVotes: false
        }
    },
    computed:{
        ...mapState(['currentVote', 'userVote']),
        ...mapGetters(['selectedGameModule']),
        rankedVotes(){
            return _(this.currentVote.votes)
                .sortBy('count')
                .reverse()
                .map((vote,i)=>{
                    vote.rank = i + 1;
                    return vote;
                })
                .value()
        },
        totalVotes () {
            const { votes } = this.currentVote
            return votes.reduce((memo, voteObj) => {
                return memo + voteObj.count
            }, 0)
        },
        maxResults(){
            if(!this.selectedGameModule)
                return 3
            if (this.seeAllVotes) {
                return this.rankedVotes.length
            } else {
                return this.selectedGameModule.gameOptions.maxVoteResults
            }
        },
        showToggleVotesBtn () {
            const { rankedVotes, maxResults } = this
            return rankedVotes.length > maxResults || this.seeAllVotes
        },
        topAggregatedVotes(){
            return this.rankedVotes.slice(0, this.maxResults)
        },
        userAggregatedVote(){
            return this.rankedVotes.filter(voteObj => {
                return voteObj.vote === this.userVote
            })
        }
    },
    mounted(){
        this.$smoothReflow({
            el: '.top-results'
        })
    },
    methods: {
        toggleSeeAllVotes () {
            this.seeAllVotes = !this.seeAllVotes
        }
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
    position: relative;
    display: flex;
    max-height: 100%;
    min-height: 0;
    font-size: 0.9rem;
    .fade-leave-active {
        position: absolute;
    }
}

.top-results {
    flex: 1;
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: auto;
    .info-bar {
        padding: 10px 0px;
        text-align: center;
    }
    .vote-table {
        overflow-y: auto;
        padding: 0 5px;
    }
    .action-bar {
        text-align: center;
        padding: 10px;
    }
    .toggle-votes-list {
        color: #fafafa;
    }
}

.no-results {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    &.fade-leave-active {
        width: calc(100% - 30px);
    }
}

</style>
