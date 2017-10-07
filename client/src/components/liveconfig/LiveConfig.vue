<template>
	<div class="live-config">
		<button @click="startVote" class="button">Start a vote</button>
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

$scrollbar-width: 17px;

.live-config{
    font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
    font-weight: 300;
    padding: 10px;
    padding-right: 10px + $scrollbar-width;
    color: #333;
    .overlay-background {
        background: white !important;
    }
}

</style>
