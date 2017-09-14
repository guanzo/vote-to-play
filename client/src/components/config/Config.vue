<template>
	<div class="config">
		<p>
            The content that the viewers vote on is determined by the game that you set in your stream information.
            For example, if you want viewers to vote on a Dota 2 hero, make sure to set Dota 2 as the game on Twitch.
        </p>
	</div>
</template>

<script>

import {SET_GAME} from '@/store/mutations'

export default {
	name: 'config',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.config {
    color: #333;
    font-size: 1.25em;
    padding: 15px;
}

</style>
