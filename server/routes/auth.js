const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
// Middleware to require login/auth
// const requireAuth = passport.authenticate('jwt', { session: false });
// const requireLogin = passport.authenticate('local', { session: false });
module.exports = app => {
  // Initializing route groups
  const apiRoutes = express.Router();
  const authRoutes = express.Router();

  //=========================
  // Auth Routes
  // EXAMPLE: http://localhost:3000/api/auth/register
  //=========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use(authRoutes);

  // Login route
  // authRoutes.post('/login', (req, res, next) => {

  //   res.status(200).json({
  //     msg: 'wooo',
  //   });
  // });
  // req.body.token,
  // API ROUTES -------------------



  // route to authenticate a user (POST http://localhost:8080/api/authenticate)


  // route middleware to verify a token
  apiRoutes.use(function (req, res, next) {
    console.log(req.headers, 'any token here?')
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers.token;
    const secret = new Buffer(process.env.TWITCH_EXTENSION_SECRET, 'base64');

    // decode token
    if (token) {
      console.log(token, 'token is here?')
      console.log(process.env.TWITCH_EXTENSION_SECRET, 'secret is here');
      // verifies secret and checks exp
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          console.log(err, 'did not verify')
          return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {

          req.decoded = decoded;
          const tokenObj = {
            exp: Math.floor(new Date().getTime() / 1000) + 60,
            user_id: decoded.user_id,
            role: decoded.role,
            pubsub_perms: decoded.pubsub_perms
          }
          req.signedToken = jwt.sign(tokenObj, secret);
          // if everything is good, save to request for use in other routes
          next();
        }
      });

    } else {

      // if there is no token
      // return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });

    }
  });

  apiRoutes.get('/authenticate', (req, res, next) => {
    res.status(200).json({ success: true, token: req.signedToken });
  });

  // Set url for API group routes
  app.use('/api', apiRoutes);
};
