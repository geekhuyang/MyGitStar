var _ = require('underscore');
var mongoose = require('mongoose');

// var host = 'mongodb://stone:6612683@oceanic.mongohq.com:10010/mygitstar';

// var db = mongoose.connect(host, function (err) {
// 	"use strict";
// 	if (err) {
// 		console.error('connect to %s error: ', host, err.message);
// 		// process.exit(1);
// 	}
// });

// var User = require('./models').User;
// var StarItem = require('./models').StarItem;

// User.find({}, function (err, users) {
// 	if (err) {
// 		return console.log(err);
// 	}
// 	users = _.sortBy(users, function (user) { return -user.visit; });
// 	StarItem.count({}, function (err, count) {
// 		if (err) {
// 			return console.log(err);
// 		}
// 		console.log('count: ', count);
// 			// users: users,
// 			// format_date: format_date,
// 			// count: count
// 	});
// });
