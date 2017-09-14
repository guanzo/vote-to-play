<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>

export default {
	name: 'app',
	data() {
		return {
			showLogo: false
		}
	},
	computed:{
		route(){
			return this.$route
		}
	},
	created(){
	},
	methods: {
		testClick() {
			this.showLogo = !this.showLogo;
		}
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
}

#app {
    font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
    font-weight: 300;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    max-height:100%;
    width:100%;
    color: #eee;
    overflow: auto;
}

</style>
