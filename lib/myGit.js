var github = require('octonode');
var client = github.client();

// 获取user的star数据
var getStars = function (user, callback) {
	"use strict";
	var pageCount = 1, perPage = 100;
	var datas = [];

	user = (user && typeof user === 'string' && user !== '') ? user : 'Sidong';
	var gitUser = '/users/' + user + '/starred';
	// var filepath = util.handleFilepath(user, 'stars');

	var done = function () {
		console.log("all stars: ", datas.length);
		// 保存json，以两个空格为分隔符
		datas = JSON.stringify(datas, '', '  ');
		callback(null, datas);
	};

	var getPageFromPage = function () {
		console.log("Star getting datas from github page: %s", pageCount);
		client.get(gitUser, {page: pageCount, per_page: perPage}, function (err, status, body) {
			if (err === null && status === 200) {
				console.log("page: %s, length: %s", pageCount, body.length);
				datas = datas.concat(body);
				if (body.length === perPage) {
					++pageCount;
					console.log("try next page!");
					getPageFromPage();
				} else {
					console.log("all done!");
					done();
				}
			} else if (err) {
				callback(err);
			} else {
				callback(new Error("Something wrong! Status: " + status));
			}
		});
	};

	getPageFromPage(user);
};

// 获取user信息,默认user='Sidong'
var getInfo = function (user, callback) {
	"use strict";

	user = (user && typeof user === 'string' && user !== '') ? user : 'Sidong';
	var gitUser = '/users/' + user;

	client.get(gitUser, {}, function (err, status, body) {
		if (err === null && status === 200) {
			console.log("get user info successfully info.length: %s", body.length);
			var data = JSON.stringify(body);
			callback(err, data);
		} else if (err) {
			callback(err);
		} else {
			callback(new Error("Something wrong! Status: " + status));
		}
	});
};

exports.getInfo = getInfo;
exports.getStars = getStars;
