<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>

export default {
    name: 'app',
}
</script>

<style lang="scss">

html,
body {
    background: transparent !important;
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
