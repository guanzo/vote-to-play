<template>

<div class="vote-list">
    <h4>Results</h4>
    <br>
    <transition-group name="vote-list" tag="div">
        <div v-for="(vote,i) in aggregatedVotes" class="vote-list-item" :key="vote.vote">
            <slot name="vote"
                :obj="vote"
                :rank="i+1"
            >
            </slot>
        </div>
    </transition-group>
</div>

</template>

<script>

import _ from 'lodash'

export default {
    name: 'vote-list',
    computed:{
        channelId(){
            return this.$store.state.channelId
        },
        userVotes(){
            return this.$store.state.votes
        },
        aggregatedVotes(){
            let maxResults = 5;
            return _(this.userVotes)
                .countBy('vote')
                .map((count, vote)=> ({ vote, count }))
                .sortBy('count')
                .reverse()
                .take(maxResults)
                .value()
        }

    },
}

</script>

<style lang="scss" scoped>

.vote-list{
    flex: 1 0 300px;
    padding: 15px;
    margin-left: 10px;
    background: $overlay-background;
    h4 {
        text-align: center;
    }
}

.vote-list-item {
  transition: all 1s;
}
.vote-list-enter, .vote-list-leave-to{
  opacity: 0;
  transform: translateY(30px);
}
.vote-list-leave-active {
  position: absolute;
}

</style>