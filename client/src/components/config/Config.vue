<template>
	<div class="config">
		<p>
            The content that the viewers vote on is determined by the game that you set in your stream information.
            <br>
            For example, if you want viewers to vote on a Dota 2 hero, make sure to set Dota 2 as the game on Twitch.
        </p>
        <br>
        <p>
            Remember, you also get one vote!
        </p>
        
        <br>
        <br>
        If you would like to suggest any features, please feel free to email me.
	</div>
</template>

<script>

import {SET_GAME} from '@/store/mutations'

export default {
	name: 'config',
}
</script>


<style lang="scss" scoped>

.config {
    font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
    font-weight: 300;
    color: #333;
    font-size: 1.25em;
    padding: 15px;
}

</style>
