const jwt = require('jsonwebtoken');

module.exports = app => {
/*
    Twitch handles user authentication, gives me jwt
    Only authenticate api routes
*/
  app.use('/api',function (req, res, next) {
    // check header or url parameters or post parameters for token
    const token = req.body.token || req.query.token || req.headers.token || req.headers.authorization;
    const secret = Buffer.from(process.env.TWITCH_EXTENSION_SECRET, 'base64');
    
    if(!token){
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
          })
    }

    jwt.verify(token, secret, function (err, decoded) {
        if (err) {
            console.log(err, 'did not verify')
            return res.json({ success: false, message: 'Failed to authenticate token.' });
        } 

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
        
    });
  });

};
