<template>

<div class="vote-results">
    <div class="top-votes overlay-background" ref="topvotes">
        <h4>Results</h4>
        <br>
        <transition name="fade" mode="out-in">
            <transition-group v-if="topAggregatedVotes.length" class="vote-list" name="vote-list" tag="div">
                <div v-for="(vote,i) in topAggregatedVotes"  class="vote-item" :key="vote.vote">
                    <span class="rank">{{ i+1 + "." }}</span>
                    <slot name="vote"
                        :obj="vote"
                    >
                    </slot>
                    {{ vote.vote }} 
                    <span class="count">{{ vote.count }}</span>
                </div>
            </transition-group>
            <div v-else class="has-text-centered">
                Waiting for votes...
            </div>
        </transition>
    </div>
    <transition name="fade-vertical">
        <div v-if="userVote" class="user-vote overlay-background">
            <h4>Your Vote</h4>
            <br>
            <div class="vote-item">
                <span class="rank">{{ userAggregatedVote.rank + "." }}</span>
                <slot name="vote"
                    :obj="userAggregatedVote"
                >
                </slot>
                {{ userAggregatedVote.vote }} 
                <span class="count">{{ userAggregatedVote.count }}</span>
            </div>
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
        allAggregatedVotes(){
            return _(this.votes)
                .countBy('vote')
                .map((count, vote)=> ({ vote, count }))
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
            console.log(arguments)
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

		}
	}
}

</script>

<style lang="scss" scoped>

.vote-results{
    flex: 0 0 325px;
    position: relative;
    margin-left: 15px;
    //transition: 0.5s;
    //max-height: 100%;
    h4 {
        text-align: center;
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

.vote-list-enter, .vote-list-leave-to{
  opacity: 0;
  transform: translateY(30px);
}
.vote-list-leave-active {
  position: absolute;
}

.vote-item{
    display: flex;
    align-items: center;
    transition: all 1s;
    margin-bottom: 5px;
    .rank {
        width: 30px;
        text-align: center;
    }
    img {
        margin: 0px 10px;
    }
    .count {
        margin-left: auto;
    }
}

</style>