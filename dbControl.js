// var EventProxy = require('eventproxy');
var fs = require('fs');
var mongoose = require('mongoose');
var myGit = require('./lib/myGit');
var _ = require('underscore');
var url = require('url');

var User = require('./proxy').User;

var config = require('./config').config;
var host = url.parse(config.host);
console.log(host);

