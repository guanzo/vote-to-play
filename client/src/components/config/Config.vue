<template>
	<div class="config">
        <p>Thanks for installing Vote to Play!</p>
        <p>
            If you want viewers to vote on game characters, make sure you set the game in your stream information.<br>
            For example, if you want viewers to vote on a Dota 2 hero, make sure to set Dota 2 as the game on Twitch, and click "Start a Vote".
        </p>
		<p>
            If you want viewers to vote on games, select "All Games" as the vote category, and click "Start a Vote".
        </p>
        <p>You can do all this on your Dashboard - Live. Changing the game will also trigger a vote.</p>
        <p>Remember, you also get to vote!</p>
        
        <br>
        <br>
        If you would like to suggest any features, please feel free to email me.
	</div>
</template>

<script>

export default {
	name: 'config',
}
</script>


<style lang="scss" scoped>

.config {
    color: #333;
    font-size: 1.25em;
    padding: 15px;
    p{
        margin-bottom: 15px;
    }
}

</style>
