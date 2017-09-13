import axios from 'axios';

//https://localhost:3001/api/auth/login

export default function () {
  if (window.Twitch.ext) {

    window.Twitch.ext.onAuthorized(function (auth) {
      console.log(auth);
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
      console.log(context);
      console.log(contextFields);
    });

    window.Twitch.ext.onError(function (err) {
      console.error(err);
    });

  }

}
