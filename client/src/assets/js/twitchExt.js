import axios from 'axios';
import store from '@/store'
import { SET_AUTH, SET_GAME } from '@/store/mutations'

export default function () {

    //uncomment when not testing inside twitch, b/c the socket joins the rooms upon auth
    //store.dispatch(SET_AUTH, { channelId: 5, userId: 5 })

    window.Twitch.ext.onAuthorized(function (auth) {
        //adds token to every request sent thru axios
        axios.defaults.headers.common['Authorization'] = auth.token;
        
        store.dispatch(SET_AUTH, { channelId: auth.channelId, userId: auth.userId })
        
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

}
