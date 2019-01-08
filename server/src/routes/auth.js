const jwt = require('jsonwebtoken');

module.exports = app => {
	app.use('/api',function (req, res, next) {
		// check header or url parameters or post parameters for token
		let authHeader = req.headers.authorization;
		if (!authHeader) {
			return res.status(403).send({
				success: false,
				message: 'No authorization header provided.'
			})
		}
		const secret = Buffer.from(process.env.TWITCH_EXTENSION_SECRET, 'base64');
		const token = authHeader.split(' ')[1]

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

			req.decodedJwt = decoded;
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
