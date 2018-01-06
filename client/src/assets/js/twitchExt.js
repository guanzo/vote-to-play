
import store from '@/store'
import { SET_AUTH, SET_GAME } from '@/store/mutations'


let timeoutId = null;

window.Twitch.ext.onAuthorized(async (auth) => {
    let parts = auth.token.split(".");
    let payload = JSON.parse(window.atob(parts[1]));
    let role = payload.role
    let [channelName, game] = await Promise.all([getChannelName(auth.channelId), getSelectedGame(auth.channelId)])

	//console.log(payload)
	//console.log(auth)
    store.commit(SET_GAME, game)
    //send game to server to set vote category 
    //in case this is the first visit to a channel that doesn't exist in the database
    store.dispatch(SET_AUTH, { 
        channelId: auth.channelId, 
        channelName, 
        game,
        token: auth.token, 
        userId: auth.userId, 
        role 
    })

	clearTimeout(timeoutId)
    timeoutId = setTimeout(()=>pollSelectedGame(auth.channelId))
});

//testing on localhost window, and not inside twitch iframe
//i need to join a room so that i can cast votes locally
if(!inIframe() && process.env.NODE_ENV === 'development'){
    let token = process.env.TEST_TOKEN
    let role = 'broadcaster'
    store.dispatch(SET_AUTH, { channelId: -1, userId: -1, token, role, channelName: 'guanzo' })
}

async function pollSelectedGame(channelId, pollInterval = 4000){
    let game = await getSelectedGame(channelId)
	let storeGame = store.state.selectedGame
	if(game !== storeGame)
		store.commit(SET_GAME, game)
	timeoutId = setTimeout(()=>pollSelectedGame(channelId),pollInterval)
}

async function getSelectedGame(channelId){
    let response = await axios.get(`https://api.twitch.tv/kraken/channels/${channelId}`,{
        headers:{
            Accept: 'application/vnd.twitchtv.v5+json',
            'Client-ID': EXTENSION_CLIENT_ID,
        }
	})
	return response.data.game
}

window.Twitch.ext.onError(console.error);

function inIframe() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function getChannelName(channelId){
    return axios.get(`https://api.twitch.tv/helix/users?id=${channelId}`, {
        headers:{
            'Client-Id':EXTENSION_CLIENT_ID,
        }
    }).then((response)=>{
        let channelName = response.data.data[0].display_name;
        return channelName
    })
}