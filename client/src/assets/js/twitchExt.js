
import store from '@/store'
import { SET_AUTH, SET_GAME } from '@/store/mutations'

//testing on localhost window, and not inside twitch iframe
//i need to join a room so that i can cast votes locally
if(!inIframe() && process.env.NODE_ENV == 'development'){
    let token = process.env.TEST_TOKEN
    let role = 'broadcaster'
    store.dispatch(SET_AUTH, { channelId: -1, userId: -1, token, role, channelName: 'guanzo' })
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
    pollSelectedGame(auth.channelId)
});

function pollSelectedGame(channelId){
    let pollInterval = 4000
    axios.get(`https://api.twitch.tv/kraken/channels/${channelId}`,{
        headers:{
            'Accept': 'application/vnd.twitchtv.v5+json',
            'Client-ID':EXTENSION_CLIENT_ID,
        }
    })
    .then((response)=>{
        let game = response.data.game
        let storeGame = store.state.selectedGame
        if(game != storeGame)
            store.commit(SET_GAME, { game })
        
        setTimeout(()=>pollSelectedGame(channelId),pollInterval)
    })
}


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
            'Client-Id':EXTENSION_CLIENT_ID,
        }
    }).then((response)=>{
        let channelName = response.data.data[0].display_name;
        return channelName
    })
}