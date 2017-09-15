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
const privateKey = fs.readFileSync('./ssl/key.pem');
const certificate = fs.readFileSync('./ssl/cert.pem');

require('./data.js')

// app.use((req, res, next) => {
//   console.log('Got request', req.path, req.method);
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
//   res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   next();
// });
app.use(cors({ credentials: true, origin: true }))
http.createServer(app).listen(80);

let server = https
  .createServer(
  {
    key: privateKey,
    cert: certificate,
  },
  app
  )
  .listen(process.env.PORT || 3001);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(logger('dev'));

authRouter(app);
voteRouter(app,server);
// Express only serves static assets in production
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'));
// }

app.listen(8081, () => {
    console.log(process.env.PASSPORT_SECRET, 8081);
    console.log(`Find the server at: https://localhost:${process.env.PORT || 3001}/`); // eslint-disable-line no-console
});
