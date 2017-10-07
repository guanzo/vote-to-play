<template>

<div class="vote-results">
    <div class="top-votes overlay-background" ref="topvotes">
        <h4 class="is-size-5"><b>Results</b></h4>
        <transition name="fade" mode="out-in">
            <table v-if="topAggregatedVotes.length">
                <thead>
                    <tr>
                        <td>Rank</td>
                        <td></td>
                        <td></td>
                        <td class="has-text-right">Votes</td>
                    </tr>
                </thead>
                <transition-group class="vote-list" name="vote-list" tag="tbody">
                    <tr v-for="(vote,i) in topAggregatedVotes"  class="vote-item" :key="vote.vote">
                        <td class="rank">{{ i+1 }}</td>
                        <td class="vote-image">
                            <slot name="vote" :obj="vote">
                                <img :src="getHeroImage(vote.vote)" :alt="vote.vote">
                            </slot>
                        </td>
                        <td>{{ vote.vote }}</td> 
                        <td class="count">{{ vote.count }}</td> 
                    </tr>
                </transition-group>
            </table>
            <div v-else class="has-text-centered">
                Waiting for votes...
            </div>
        </transition>
    </div>
    <transition name="fade-vertical">
        <div v-if="userVote" class="user-vote overlay-background">
            <h4 class="is-size-5"><b>Your Vote</b></h4>
            <table>
                <thead>
                    <tr>
                        <td class="has-text-centered">Rank</td>
                        <td></td>
                        <td></td>
                        <td class="has-text-right">Votes</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="has-text-centered">{{ userAggregatedVote.rank }}</td>
                        <td class="vote-image">
                            <slot name="vote" :obj="userAggregatedVote">
                                <img :src="getHeroImage(userAggregatedVote.vote)" :alt="userAggregatedVote.vote">
                            </slot>
                        </td>
                        <td>{{ userAggregatedVote.vote }} </td>
                        <td class="has-text-right">{{ userAggregatedVote.count }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </transition>
</div>

</template>

<script>

import _ from 'lodash'
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
        game(){
            return this.$store.getters.getSelectedGameModule
        },
        allAggregatedVotes(){
            let totalVotes = this.votes.length;
            return _(this.votes)
                .countBy('vote')
                .map((count, vote)=> ({ vote, count, percent: Math.round((count/totalVotes)*100) }))
                .sortBy('count')
                .reverse()
                .value()
        },
        topAggregatedVotes(){
            return this.allAggregatedVotes.slice(0, this.maxResults)
        },
        userAggregatedVote(){
            let rank = _.findIndex(this.allAggregatedVotes, vote=>vote.vote == this.userVote) + 1
            let result = _(this.allAggregatedVotes).find(vote=>vote.vote == this.userVote)
            return Object.assign(result, { rank })
        }
    },
    watch:{
        ['topAggregatedVotes.length'](newLength, oldLength){
            if(newLength != oldLength)
                this.animateHeight()
        }
    },
    mounted(){
        let el = this.$refs.topvotes
    },
	methods:{
		animateHeight(){
			let el = this.$refs.topvotes
            let beforeHeight = el.clientHeight
            this.$nextTick(()=>{
                let afterHeight = el.clientHeight
                el.style.height = beforeHeight+'px'
                el.offsetHeight//force reflow
                el.style.height = afterHeight+'px'

                
                el.addEventListener('transitionend',()=>{
                    el.style.height = 'auto'
                }, { once: true })
            })
		},
        getHeroImage(name){
            let hero = _.find(this.game.heroes,hero=>{
                return hero.name.toLowerCase() == name.toLowerCase()
            })
            return hero.img
        }
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
}

.top-votes, .user-vote {
    padding: 15px;
}

.top-votes {
    position: relative;
    overflow: hidden;
    margin-bottom: 15px;
    transition: height 1s;
    table {
        width: 100%;
        td {
            padding: 3px;
        }        
        tr.vote-item{
            width: 100%;
            transition: all 10s;
            margin-bottom: 5px;
            td{
                vertical-align: middle;
            }
            .rank {
                width: 20px;
                text-align: center;
            }
            .count {
                width: 35px;
                text-align: right;
            }
            img {
                vertical-align: middle;
            }
            .percent {
                width: 45px;
                text-align: right;
            }
        }
    }
}

.user-vote{
    table {
        width: 100%;
    }
}

.vote-list-enter, .vote-list-leave-to{
  opacity: 0;
  transform: translateY(30px);
}
.vote-list-leave-active {
  position: absolute;
}


</style>