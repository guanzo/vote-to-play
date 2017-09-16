<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>

import axios from 'axios'

export default {
	name: 'app',
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
}

#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #eee;
    display: flex; 
    flex-direction: column;
    max-height:100%;
    width:100%;

}

</style>
