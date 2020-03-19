<template>
<div class="game-unsupported viewer-ui-block has-text-centered">
    <p>
        Sorry, Vote to Play doesn't support "{{ selectedGame }}". <br>
        If you believe this game is a good fit for this extension, please contact me.
    </p>
</div>
</template>


<script>
import { mapState } from 'vuex'

export default {
    name:'game-unsupported',
    computed:{
        ...mapState(['selectedGame'])
    }
}

</script>

<style lang="scss">

.viewer .game-unsupported {
    width: 500px !important;
    flex: none;
}

.game-unsupported {
    padding: 15px;
}

</style>
