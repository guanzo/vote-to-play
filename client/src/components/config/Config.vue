<template>
	<div class="config">
		<p>
            Select the game that you will be streaming. <br>
            You can also change the game in the live configuration panel on your dashboard.
        </p>
        <select-game></select-game>
	</div>
</template>

<script>

import {SET_GAME} from '@/store/mutations'
import selectGame from '../config-shared/SelectGame'

export default {
	name: 'config',
    components:{
        selectGame
    }
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
