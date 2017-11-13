<template>
	<div class="live-config">
		<button @click="startVote" class="pure-button">Start a vote</button>
        <p>Starting a vote will erase previous vote data.</p>
        <br>
        <vote-results class="vote-list">
        </vote-results>
	</div>
</template>

<script>
import { START_NEW_VOTE } from '@/store/actions'
import voteResults from '@/components/viewer/voteresults/VoteResults'

export default {
	name: 'live-config',
    created(){
    },
    methods:{
        startVote(){
            this.$store.dispatch(START_NEW_VOTE)
        }
    },
    components:{
        voteResults
    }
}
</script>


<style lang="scss">

$scrollbar-width: 17px;

.live-config{
    padding: 5px;
    color: #333;
    .overlay-background {
        background: white !important;
    }
    .vote-list.vote-results {
        margin-left: 0;
    }

}

</style>
