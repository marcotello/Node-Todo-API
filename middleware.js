var cryptojs = require('crypto-js');

module.exports = function (db) {

	return {
		requineAuthentication: function (req, res, next) {
			var token = req.get('Auth') || '';

			db.token.findOne({
				where: {
					tokenHash: cryptojs.MD5(token).toString();
				}
			}).then( function (tokenInstance) {
				if(!tokenInstance){
					thow new Error();
				}

				req.token = tokenInstance;
				return db.user.findByToken(token);

			})then( function (user) {
				req.user = user;
				next();
			}).catch( function () {
				res.status(401).send();
			});

			// db.user.findByToken(token).then( function (user) {
			// 	req.user = user;
			// 	next();
			// }, function (e) {
			// 	res.status(401).send();
			// });
		}
	};
}
