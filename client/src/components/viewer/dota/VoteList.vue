<template>

<div class="vote-list">
    <div v-for="vote in userVotes" :key="vote.userId">{{ vote.vote }}</div>
</div>

</template>

<script>

import axios from 'axios'

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

        }

    },
    methods:{
        getVote(){
            axios.get(`/api/vote/${this.channelId}`)
                .then((response)=>{
                    console.log(response)
                })
        }
    }
}

</script>

<style lang="scss" scoped>

.vote-list{
    flex: 1 0 300px;
    border: 1px solid red;
}

</style>