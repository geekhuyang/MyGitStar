var mongoose = require('mongoose');
var config = require('../config').config;

// 连接数据库
var db = mongoose.connect(config.db, function (err) {
	"use strict";
	if (err) {
		console.error('connect to %s error: ', config.db, err.message);
		process.exit(1);
	}
});

exports.db = db;

// models
var User = require('./User');
var StarItem = require('./StarItem');


// 导出modal
exports.User = mongoose.model('User', User.UserSchema);
exports.StarItem = mongoose.model('StarItem', StarItem.StarItemSchema);

// 导出属性集合，用于浅复制属性
exports.StarProperties = require('./Star').StarProperties;
exports.OwnerProperties = require('./Owner').OwnerProperties;
