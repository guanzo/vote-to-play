const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const logger = require('morgan');
const authRouter = require('./routes/auth');
const voteRouter = require('./routes/vote');
const http = require('http');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const path = require('path')


let keyPath;
let certPath;
if(process.env.NODE_ENV == 'development'){
    keyPath = path.resolve(__dirname, 'ssl/key.pem')
    certPath = path.resolve(__dirname, 'ssl/cert.pem')
} else{
    keyPath = '/etc/letsencrypt/live/guanzo.io/privkey.pem'
    certPath = '/etc/letsencrypt/live/guanzo.io/fullchain.pem'
}

const privateKey = fs.readFileSync(keyPath);
const certificate = fs.readFileSync(certPath);

console.log(process.env)
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);

app.use(cors({ credentials: true, origin: true }))
http.createServer(app);

let server = https
  .createServer(
  {
    key: privateKey,
    cert: certificate,
  },
  app
  )
  .listen(process.env.PORT || 443);

if (process.env.NODE_ENV === 'production')
    app.use(express.static(__dirname+'/public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(logger('dev'));

authRouter(app);
voteRouter(app,server);

app.listen(8081, () => {
    console.log(process.env.PASSPORT_SECRET, 8081);
    console.log(`Find the server at: https://localhost:${process.env.PORT || 443}/`); // eslint-disable-line no-console
});
