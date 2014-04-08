// var EventProxy = require('eventproxy');
var fs = require('fs');
var mongoose = require('mongoose');
var myGit = require('./lib/myGit');
var _ = require('underscore');
var base64_decode = require('base64').decode;
var base64 = require('base64-js');

var User = require('./proxy').User;
var StarItem = require('./proxy').StarItem;
var myGit = require('./lib/myGit');
var format_date = require('./lib/util').format_date;
var util = require('./lib/util');

var github = require('octonode');
var client = github.client();

var md = require('markdown').markdown;

myGit.getStars('Sidong', function (err, stars) {
	if (err) return console.log(err);
	stars = JSON.parse(stars);
	console.log(stars.length);
});
