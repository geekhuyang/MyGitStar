var _ = require('underscore');
var github = require('octonode');
var url = require('url');
var qs = require('qs');

var marked = require('marked');
var util = require('../lib/util');

var sendErrorMail = require('../services/mail').sendErrorMail;
var User = require('../proxy').User;
var StarItem = require('../proxy').StarItem;
var myGit = require('../lib/myGit');
var config = require('../config').config;

// 我的星星页面
exports.index = function (req, res) {
	"use strict";
	// 未登录
	if (!req.session.user) {
		req.flash('error', '请登入');
		return res.redirect('/signin');
	}
	// 查找user
	User.getUserById(req.session.user._id, function (err, user) {
		if (err) {
			sendErrorMail(err);
			req.flash('error', '会话失效，重新登入！');
			return res.redirect('/signin');
		}
		if (!user) {
			req.flash('error', '会话失效，重新登入！');
			return res.redirect('/signin');
		}
		// update from github
		myGit.getStars(user.githubUsername, function (err, stars) {
			if (err) {
				sendErrorMail(err);
				console.log('update from github error..');
				req.flash('error', '更新出错，请刷新页面！');
				res.render('mystars', {
					// 指定active菜单项
					active: 'user',
					// 指定脚本文件名
					script: 'starPost.min.js',
					categoriesKeys: [],
					categories: {},
					languages: [],
					length: 0,
					charCodes: []
				});
			}
			// 处理获取的数据
			stars = JSON.parse(stars);
			var callback = function (err) {
				if (err) {
					sendErrorMail(err);
					console.log(err);
				}
			};
			for (var i = 0; i < stars.length; i++) {
				var order = i;
				StarItem.updateOrSave(user._id, stars[i], order, callback);
			}
			user.update_at = new Date();
			user.visit = user.visit + 1;
			user.star_items = stars.length;
			user.save(function (err) {
				if (err) {
					sendErrorMail(err);
					console.log(err);
				}
			});

			// 查找star item
			StarItem.getByUserId(user._id, function (err, starItems) {
				var length = starItems.length;
				
				// 计算各语言数量 并排序
				var languages = _.chain(starItems).reduce(function (counts, starItem) {
					counts[starItem.star.language] = (counts[starItem.star.language] || 0) + 1;
					return counts;
				}, {}).value();
				var keys = _.keys(languages);
				var values = _.toArray(languages);
				keys = _.sortBy(keys, function (key) { return -languages[key]; });
				values = values.sort(function (a, b) { return b - a; });
				languages = _.object(keys, values);

				var categories = _.groupBy(starItems, 'category');
				var categoriesKeys = _.keys(categories);

				// 未分类置前
				categoriesKeys.sort();
				var unClassified = '未分类';
				var index = categoriesKeys.indexOf(unClassified);
				if (index !== -1) {
					categoriesKeys.splice(index, 1);
					categoriesKeys.unshift(unClassified);
				}

				// 复制categoriesKeys一份副本，将所有字符串转为`字符编码-字符编码..`
				// 某个分类 node 转换为 --> n的字符编码-o的字符编码-d的字符编码-e的字符编码
				// 因为在html的id属性中，只能包含数字、字母、分号有限的字符
				// 经过转义，可以对分类的id设置为分类的名称转义后的字符串
				var charCodes = categoriesKeys.slice(0, categoriesKeys.length);
				for (var i = 0; i < charCodes.length; i++) {
					var name = charCodes[i];
					var result = [];
					for (var j = 0; j < name.length; j++) {
						result.push(name.charCodeAt(j));
					}
					charCodes[i] = result.join('-');
				}
				res.render('mystars', {
					// 指定active菜单项
					active: 'user',
					// 指定脚本文件名
					script: 'starPost.min.js',
					categoriesKeys: categoriesKeys,
					categories: categories,
					languages: languages,
					length: length,
					charCodes: charCodes
				});
			});
		});
	});
};

// ajax post 修改 starItem
exports.ajaxPost = function (req, res) {
	"use strict";
	var message;
	if (!req.session.user) {
		message = {
			status: false,
			message: '会话失效，重新登入！'
		};
		return res.send(JSON.stringify(message));
	}
	if (req.body.action === 'update') {
		// 更新操作
		req.checkBody('category', '类别名称长度为0至20个字符，空字符代表“未分类”。').len(0, 20);
		var err = req.validationErrors();
		if (err) {
			message = {
				status: false,
				message: err[0].msg
			};
			return res.send(JSON.stringify(message));
		}
		// trim
		req.sanitize('starid').trim();
		req.sanitize('category').trim();
		// req.sanitize('tags').trim();
		req.sanitize('remark').trim();
		if (req.body.category === '') { req.body.category = '未分类'; }
		// if (req.body.tags !== '') { req.body.tags = req.body.tags.split(' '); }

		StarItem.getByUserIdAndStarID(req.session.user._id, Number(req.body.starid), function (err, starItem) {
			if (err) {
				message = {
					status: false,
					message: '数据库查询失败，请重新尝试！'
				};
				return res.send(JSON.stringify(message));
			}
			starItem.remark = req.body.remark;
			starItem.category = req.body.category;
			// starItem.tags = req.body.tags;
			starItem.update_at = new Date();
			starItem.save(function (err) {
				if (err) {
					message = {
						status: false,
						message: '数据库更新失败，请重新尝试！'
					};
					return res.send(JSON.stringify(message));
				}
				message = {
					status: true,
					message: '操作成功！',
					starid: req.body.starid,
					remark: req.body.remark,
					// tags: (typeof req.body.tags === 'object' ? req.body.tags.join(' ') : req.body.tags),
					category: req.body.category
				};
				return res.send(JSON.stringify(message));
			});
		});
	}
};

// ajax 请求从 github 更新用户数据
exports.ajaxUpdateFromGithub = function (req, res) {
	"use strict";
	var message;
	if (!req.session.user) {
		message = {
			status: false,
			message: '会话失效，重新登入！'
		};
		return res.send(JSON.stringify(message));
	}
	User.getUserById(req.session.user._id, function (err, user) {
		if (err) {
			message = {
				status: false,
				message: err.message
			};
			return res.send(JSON.stringify(message));
		}
		var now = new Date();
		if (now - user.update_at < config.update_interval) {
			message = {
				status: false,
				message: '更新过于频繁，请稍后再更新。更新间隔为' + config.update_description + '。'
			};
			return res.send(JSON.stringify(message));
		}
		myGit.getStars(user.githubUsername, function (err, stars) {
			if (err) {
				console.log('getStar error!');
				message = {
					status: false,
					message: err.message
				};
				return res.send(JSON.stringify(message));
			}
			// 处理获取的数据
			console.log(stars.length);
			stars = JSON.parse(stars);
			var errorItem = [];
			var callback = function (err) {
				if (err) {
					errorItem.push(stars[i].name);
				}
			};
			for (var i = 0; i < stars.length; i++) {
				var order = i;
				StarItem.updateOrSave(user._id, stars[i], order, callback);
			}
			if (errorItem.length) {
				console.log('some error');
				var names = errorItem.join(' ');
				message = {
					status: false,
					message: '部分更新出错：' + names
				};
				return res.send(JSON.stringify(message));
			} else {
				user.update_at = new Date();
				user.save(function (err) {
					if (err) { console.log(err); }
				});
				console.log('success');
				message = {
					status: true,
					message: '更新成功，请刷新页面！'
				};
				return res.send(JSON.stringify(message));
			}
		});
	});
};

// get readme
exports.readme = function (req, res) {
	"use strict";
	var query = url.parse(req.url).query;
	var params = qs.parse(query);
	var client = github.client();
	var apiurl = '/repos/' + params.author + '/' + params.repo + '/readme';
	console.log(apiurl);
	client.get('/repos/' + params.author + '/' + params.repo + '/readme', {}, function (err, status, body) {
		if (err) {
			return res.render('readme', {
				author: params.author,
				repo: params.repo,
				contents: '',
				error: 'Error: ' + err.message
			});
		}
		var contents = body.content;
		contents = util.utf8to16(util.base64decode(contents));
		return res.render('readme', {
			author: params.author,
			repo: params.repo,
			contents: contents,
			marked: marked
		});
	});
};
