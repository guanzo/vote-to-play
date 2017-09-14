import axios from 'axios';
import store from '@/store'
import { SET_AUTH, SET_GAME } from '@/store/mutations'

//https://localhost:3001/api/auth/login

export default function () {
    window.Twitch.ext.onAuthorized(function (auth) {
        axios.defaults.headers.common['Authorization'] = auth.token;
        
        store.dispatch(SET_AUTH, { channelId: auth.channelId, userId: auth.userId })
        
        
        const url = `https://localhost:3001/api/authenticate`;
        const config = {
            headers: {
                token: auth.token
            }
        };

        
        axios.get(url, config)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });

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
