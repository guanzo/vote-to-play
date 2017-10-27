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
    watch:{
        
        //Get Live Channels with Extension Activated
        /*channelId(){
            axios.get(`https://api.twitch.tv/extensions/277964/live_activated_channels`,{
                headers:{
                'Client-ID':'9p87e0fdl3h6gbn8ijwpdc7xszri8m',
                //'Authorization': 'OAuth rq9petxfbzsucdtlgui6zdpoygab3r'
            }
            }).then((response)=>{
            console.log(response)
            })
        }*/
    },
    created(){
        /*
        axios.get('https://api.twitch.tv/kraken/users?login=dillonm483',{
            headers:{
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID':'9p87e0fdl3h6gbn8ijwpdc7xszri8m',
            'Authorization': 'OAuth rq9petxfbzsucdtlgui6zdpoygab3r'
        }
        }).then((response)=>{
        console.log(response)
        })*/
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
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #eee;
    display: flex; 
    flex-direction: column;
    height:100%;
    width:100%;

}

</style>
