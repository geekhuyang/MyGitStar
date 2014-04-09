// site
var User = require('../models').User;
var moment = require('moment');
var format_date = require('../lib/util').format_date;

// 首页
exports.index = function (req, res) {
	"use strict";
	res.render('index', {
		// 指定active菜单项
		active: 'home',
		// 指定脚本文件名
		script: 'main.min.js'
	});
};

// 404
exports.site404 = function (req, res) {
	"use strict";
	res.render('404', {
	});
};

// about
exports.about = function (req, res) {
	"use strict";
	res.render('about', {
		// 指定active菜单项
		active: 'about',
		// 指定脚本文件名
		script: 'main.min.js'
	});
};

exports.report = function (req, res) {
	if (!req.session.user) {
		req.flash('error', '请登录！');
		return res.redirect('/signin');
	}
	if (!req.session.user.is_admin) {
		return res.redirect('/404');
	}
	User.find({}, function (err, users) {
		if (err) {
			req.flash('error', error.message);
			res.render('report');
		}
		res.render('report', {
			users: users,
			format_date: format_date
		});
	});
}
