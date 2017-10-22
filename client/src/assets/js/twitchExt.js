
import store from '@/store'
import { SET_AUTH, SET_GAME, SET_STREAMER_NAME } from '@/store/mutations'

//testing on localhost window, and not inside twitch iframe
//i need to join a room so that i can cast votes locally
if(!inIframe() && process.env.NODE_ENV == 'development'){
    store.dispatch(SET_AUTH, { channelId: 5, userId: 5 })
}
window.Twitch.ext.onAuthorized(function (auth) {
    //adds token to every request sent thru axios
    axios.defaults.headers.common['Authorization'] = auth.token;
    
    store.dispatch(SET_AUTH, { channelId: auth.channelId, userId: auth.userId })
    getStreamerName(auth.channelId)
});

window.Twitch.ext.onContext(function (context, contextFields) {
    //console.log(context);
    let game = store.state.selectedGame
    if(context.game != game)
        store.commit(SET_GAME, { game: context.game })
});

window.Twitch.ext.onError(function (err) {
    console.error(err);
});

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function getStreamerName(channelId){
    
    axios.get(`https://api.twitch.tv/helix/users?id=${channelId}`,{
        headers:{
            'Client-ID':'9p87e0fdl3h6gbn8ijwpdc7xszri8m',
        }
    }).then((response)=>{
        let streamerName = response.data.data[0].display_name;
        store.commit(SET_STREAMER_NAME, { streamerName })
    })
}