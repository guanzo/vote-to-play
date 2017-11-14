
import store from '@/store'
import { SET_AUTH, SET_GAME } from '@/store/mutations'

//testing on localhost window, and not inside twitch iframe
//i need to join a room so that i can cast votes locally
if(!inIframe() && process.env.NODE_ENV == 'development'){
    store.dispatch(SET_AUTH, { channelId: -1, userId: -1, channelName: 'guanzo' })
}

window.Twitch.ext.onAuthorized(async function (auth) {
    //adds token to every request sent thru axios
    var parts = auth.token.split(".");
    var payload = JSON.parse(window.atob(parts[1]));
    var role = payload.role
    let channelName = await getChannelName(auth.channelId)
    
    store.dispatch(SET_AUTH, { 
        channelId: auth.channelId, 
        channelName, 
        token: auth.token, 
        userId: auth.userId, 
        role 
    })
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

function getChannelName(channelId){
    return axios.get(`https://api.twitch.tv/helix/users?id=${channelId}`,{
        headers:{
            'Client-Id':'0ms0a4rmjh6b7beixaqndrefsz1dfy',
        }
    }).then((response)=>{
        let channelName = response.data.data[0].display_name;
        return channelName
    })
}