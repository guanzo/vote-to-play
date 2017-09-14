<template>
	<div class="live-config">
		<button @click="startVote" class="button">Start a vote</button>
	</div>
</template>

<script>
import { START_VOTE } from '@/store/actions'

export default {
	name: 'live-config',
    methods:{
        startVote(){
            this.$store.dispatch(START_VOTE)
        }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.live-config{
    padding: 10px;
}

</style>
