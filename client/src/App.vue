<template>
	<div id="app">
		testing
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
		console.log(this.$route)
	},
	methods: {
		testClick() {
			this.showLogo = !this.showLogo;
		}
	}
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  color: red;
}

img.splash {
  width: 200px;
}

.btn {
  background: #cc0000;
  padding: 40px;
  border-radius: 20px;
  cursor: pointer;
}
</style>
