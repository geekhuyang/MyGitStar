var crypto = require('crypto');

var config = require('../config').config;

// show sign in
exports.showSignin = function (req, res) {
	"use strict";
	if (req.session.user) {
		console.log('已登录');
		req.flash('error', '你已登录');
		return res.redirect('/home');
	}
	res.render('signin', {
		// 指定active菜单项
		active: 'signin',
		// 指定脚本文件名
		script: 'main.min.js'
	});
};

// sign out
exports.signout = function (req, res) {
	"use strict";
	req.session.destroy();
	res.clearCookie(config.auth_cookie_name, { path: '/' });
	res.redirect(req.headers.referer || 'home');
};

// private
// 加密产生cookie
function gen_session(user, res) {
	"use strict";
	var auth_token = encrypt(user._id + '\t' + user.name + '\t' + user.email, config.session_secret);
	res.cookie(config.auth_cookie_name, auth_token, {path: '/', maxAge: config.maxAge});
}
exports.gen_session = gen_session;

function encrypt(str, secret) {
	"use strict";
	var cipher = crypto.createCipher('aes192', secret);
	var enc = cipher.update(str, 'utf8', 'hex');
	enc += cipher.final('hex');
	return enc;
}
