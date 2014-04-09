var passport = require('passport');

var site = require('./site');
var sign = require('./sign');
var user = require('./user');
var mystars = require('./mystars');
var github = require('./github');

module.exports = function (app) {
	"use strict";
	// home page
	app.get('/', site.index);
	app.get('/home', site.index);
	app.get('/about', site.about);
	app.get('/404', site.site404);

	// signin/signout
	app.get('/signin', sign.showSignin);
	app.get('/signout', sign.signout);

	// user
	app.get('/setting', user.showSetting);
	app.post('/setting', user.setting);

	// github oauth
	app.get('/auth/github', github.githubSetting, passport.authenticate('github'));
	app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/signin' }), github.callback);
	app.get('/auth/github/create', github.create);

	// mystars
	app.post('/ajaxPost', mystars.ajaxPost);
	app.get('/mystar', mystars.index);
	// app.post('/ajaxUpdateFromGithub', mystars.ajaxUpdateFromGithub);
	app.get('/readme', mystars.readme);
};

