var User = require('../proxy').User;

exports.showSetting = function (req, res, next) {
	"use strict";
	if (!req.session.user) {
		return res.redirect('/home');
	}
	User.getUserById(req.session.user._id, function (err, user) {
		if (err) {
			return next(err);
		}
		if (user) {
			if (req.query.save === 'success') {
				res.locals.success = '保存成功。';
			}
			return res.render('setting', {
				user: user,
				active: 'user',
				script: 'main.min.js',
			});
		} else {
			req.flash('error', '请登录');
			res.redirect('/signin');
		}
	});
};

exports.setting = function (req, res, next) {
	"use strict";
	if (!req.session.user) {
		res.redirect('home');
		return;
	}
	console.log(req.body);
	// post
	// 转义
	// req.sanitize('location').escape();
	// req.sanitize('signature').escape();
	// req.sanitize('profile').escape();
	req.sanitize('weibo').escape();
	// trim
	// req.sanitize('location').trim();
	// req.sanitize('signature').trim();
	// req.sanitize('profile').trim();
	req.sanitize('weibo').trim();

	// var location = req.body.location;
	// var signature = req.body.signature;
	// var profile = req.body.profile;
	var weibo = req.body.weibo;

	if (weibo !== '' && weibo.indexOf('@') === 0) {
		req.body.weibo = weibo = weibo.slice(1);
	}

	var err = req.validationErrors();
	if (err) {
		var message = [];
		for (var i = 0; i < err.length; i++) {
			message.push(err[i].msg);
		}
		message = message.join('\n');
		return res.render('setting', {
			// 指定active菜单项
			active: 'user',
			// 指定脚本文件名
			script: 'main.min.js',
			error: message
		});
	}

	User.getUserById(req.session.user._id, function (err, user) {
		if (err) {
			return next(err);
		}
		// user.location = location;
		// user.signature = signature;
		// user.profile = profile;
		user.weibo = weibo;

		user.save(function (err) {
			if (err) {
				return next(err);
			}
			// 跳转到show setting 如果选择render user信息已发生改变 需要再查询一次
			return res.redirect('/setting?save=success');
		});
	});
};
