// site
var _ = require('underscore');

var User = require('../models').User;
var StarItem = require('../models').StarItem;
var format_date = require('../lib/util').format_date;
// var config = require('../config').config;

// 首页
exports.index = function (req, res) {
	"use strict";
	return res.render('index', {
		// 指定active菜单项
		active: 'home',
		// 指定脚本文件名
		script: 'main.min.js'
	});
};

// 404
exports.site404 = function (req, res) {
	"use strict";
	return res.status(404).render('404', {
	});
};

// about
exports.about = function (req, res) {
	"use strict";
	return res.render('about', {
		// 指定active菜单项
		active: 'about',
		// 指定脚本文件名
		script: 'main.min.js'
	});
};

// report
exports.report = function (req, res) {
	if (!req.session.user) {
		req.flash('error', '请登录！');
		return res.redirect('/signin');
	}
	// if (!config.admins.hasOwnProperty(req.session.user.name)) {
	if (!req.session.user.is_admin) {
		return res.redirect('/404');
	}
	User.find({}, function (err, users) {
		if (err) {
			req.flash('error', error.message);
			return res.render('report');
		}
		users = _.sortBy(users, function (user) { return -user.visit; });
		StarItem.count({}, function (err, count) {
			if (err) { count = 0; }
			res.render('report', {
				users: users,
				format_date: format_date,
				count: count
			});
		});
	});
}
