<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>

export default {
	name: 'app',
    computed:{
        channelId(){
            return this.$store.state.channelId
        }
    },
    created(){
        
    }
}
</script>

<style lang="scss">

@import '~@/style/style.scss';

html{
    background: transparent !important;
}

html,
body {
    margin: 0;
    padding: 0;
    height: 100%;
}

#app {
    font-family: 'Open Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #eee;
    display: flex; 
    flex-direction: column;
    height:100%;
    width:100%;

}

</style>
