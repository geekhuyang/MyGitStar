var mailer = require('nodemailer');
var config = require('../config').config;
var marked = require('marked-prettyprint');
var util = require('util');

var transport = mailer.createTransport('SMTP', config.mail_opts);
var SITE_ROOT_URL = 'http://' + config.host;

/**
 * Send an email
 * @param {Object} data 邮件对象
 */
var sendMail = function (data) {
	"use strict";
	if (config.debug) {
		console.log('******************** 在测试环境下，不会真的发送邮件*******************');
		for (var k in data) {
			console.log('%s: %s', k, data[k]);
		}
		return;
	}
	// 遍历邮件数组，发送每一封邮件，如果有发送失败的，就再压入数组，同时触发mailEvent事件
	transport.sendMail(data, function (err) {
		if (err) {
			// 写为日志
			console.log(err);
		}
	});
};

/**
 * 发送error log mail
 * @param {Object} err
 */
exports.sendErrorMail = function (err) {
	"use strict";
	var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
	var to = config.log_mail;
	var subject = config.name + ' --- Error log mail';
	var html = '<h1><strong>Error Logs Report!</string><h1>';
	html += '<hr>';
	for (var i in err) {
		html += '<p>' + i + ': ' + String(err[i]) + '</p>';
	}

	sendMail({
		from: from,
		to: to,
		subject: subject,
		html: html
	});
};
