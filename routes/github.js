var User = require('../models').User;
var sign = require('./sign');
var config = require('../config').config;
var sendErrorMail = require('../services/mail').sendErrorMail;

exports.githubSetting = function (req, res, next) {
	"use strict";
	// 未提供github client ID，返回信息反馈
	if (config.GITHUB_OAUTH.clientID === 'local mode') {
		req.flash('error', '未开放Github Oauth认证！请注册！');
		return res.redirect('/signup');
	}
	next();
};

// github认证回调处理函数
exports.callback = function (req, res, next) {
	"use strict";
	var profile = req.user;
	User.findOne({githubId: profile.id}, function (err, user) {
		if (err) {
			err.where = 'github.callback.User.findOne';
			sendErrorMail(err);
			return next(err);
		}
		if (user) {
			user.name = profile._json.login;
			user.email = profile._json.email;
			user.avatar_url = profile._json.avatar_url;
			user.url = profile._json.html_url;
			user.githubId = profile._json.id;
			user.githubUsername = profile._json.login;

			user.save(function (err) {
				if (err) {
					err.where = 'github.callback.User.save';
					sendErrorMail(err);
					return next(err);
				}
				sign.gen_session(user, res);
				return res.redirect('/mystar');
			});
		} else {
			req.session.profile = profile;
			return res.redirect('/auth/github/create');
		}
	});
};

// github认证后新建用户
exports.create = function (req, res) {
	"use strict";
	console.log(req.session.profile);
	var profile = req.session.profile;
	if (!profile) {
		req.flash('error', 'Github 认证失效，请重新认证。');
		return res.redirect('/signin');
	}
	delete req.session.profile;
	var user = new User({
		name: profile._json.login,
		email: profile._json.email,
		avatar_url: profile._json.avatar_url,
		url: profile._json.html_url,
		githubId: profile._json.id,
		githubUsername: profile._json.login,
	});
	user.save(function (err) {
		if (err) {
			err.where = 'github.create.User.save';
			sendErrorMail(err);
			req.flash('error', err);
			return res.redirect('/signin');
		}
		req.flash('success', '成功注册！');
		req.session.user = user;
		sign.gen_session(user, res);
		return res.redirect('/mystar');
	});
};
