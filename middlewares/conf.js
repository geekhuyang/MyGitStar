var crypto = require('crypto');

var User = require('../proxy').User;
var config = require('../config').config;

// auth_user middleware 用户认证中间件，在所有路由之间，先进行认证
exports.auth_user = function (req, res, next) {
	"use strict";
	// 第一步识别运行模式，为后面载入文件提供判断
	if (config.debug) {
		res.locals.debugMode = true;
	} else {
		res.locals.debugMode = false;
	}
	// 第二步判断是否添加google track id
	if (config.google_tracker_id) {
		res.locals.google_tracker_id = config.google_tracker_id;
	}
	// 第三部添加部分变量
	res.locals.title = config.name;
	// res.locals.hostname = config.hostname;

	if (req.session.user) {
		// session登录
		// console.log('login by session');
		if (config.admins.hasOwnProperty(req.session.user.name)) {
			req.session.user.is_admin = true;
			// console.log('session --> admin!');
		}
		return next();
	} else {
		var cookie = req.cookies[config.auth_cookie_name];
		if (!cookie) {
			return next();
		}
		// cookie登录
		// console.log('login by cookie');
		var auth_token = decrypt(cookie, config.session_secret);
		var auth = auth_token.split('\t');
		var user_id = auth[0];
		User.getUserById(user_id, function (err, user) {
			if (err) {
				return next(err);
			}
			if (user) {
				req.session.user = user;
				if (config.admins.hasOwnProperty(user.name)) {
				req.session.user.is_admin = true;
					// console.log('cookie --> admin!');
				}
				return next();
			} else {
				return next();
			}
		});
	}
};

function decrypt(str, secret) {
	"use strict";
	var decipher = crypto.createDecipher('aes192', secret);
	var dec = decipher.update(str, 'hex', 'utf8');
	dec += decipher.final('utf8');
	return dec;
}
