<template>
    <table v-if="topAggregatedVotes.length">
        <thead>
            <tr>
                <td>Rank</td>
                <td></td>
                <td></td>
                <td class="has-text-right">Votes</td>
            </tr>
        </thead>
        <transition-group v-if="topAggregatedVotes.length" class="vote-list" name="vote-list" tag="tbody">
            <tr v-for="(vote,i) in topAggregatedVotes"  class="vote-item" :key="vote.vote">
                <td class="rank">{{ i+1 }}</td>
                <td class="vote-image"><slot name="vote" :obj="vote"></slot></td>
                <td>{{ vote.vote }}</td> 
                <td class="count">{{ vote.count }}</td> 
            </tr>
        </transition-group>
    </table>
</template>

<script>

export default {
    name:'vote-table',
    props: ['votes'],
}

</script>

<style lang="scss" scoped>


</style>