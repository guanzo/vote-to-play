<template>

<div class="game-unsupported overlay-background">
    <p>
        Sorry, Vote to Play doesn't support {{ selectedGame }}. <br>
        If you believe this game is a good fit for this extension, please contact me.
    </p>
</div>

</template>


<script>

export default {
    name:'game-unsupported',
    computed:{
        ...Vuex.mapState(['selectedGame'])
    }
}

</script>

<style lang="scss">

.game-unsupported {
    width: 500px !important;
    
    padding: 15px;
}

</style>