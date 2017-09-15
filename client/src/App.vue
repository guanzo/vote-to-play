<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>

import axios from 'axios'

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
	created(){/*
        axios.get('https://api.twitch.tv/kraken/users?login=dillonm483',{
            headers:{
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID':'9p87e0fdl3h6gbn8ijwpdc7xszri8m',
            'Authorization': 'OAuth rq9petxfbzsucdtlgui6zdpoygab3r'
        }
        }).then((response)=>{
        console.log(response)
        })*/
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
    color: #eee;
    display: flex; 
    flex-direction: column;
    max-height:100%;
    width:100%;

}

</style>
