// 所需加载的模块
var fs = require('fs');
var http = require('http');
var path = require('path');
// 依赖第三方模块
var express = require('express');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var moment = require('moment');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var githubStrategyMiddleware = require('./middlewares/github_strategy');
// 自定义模块
var Models = require('./models');
var config = require('./config').config;
var maxAge = config.maxAge;

var app = express();

// view engine setup --- jade模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.set('view cache', true);

app.use(favicon());

// 产品环境日记记录
if (!config.debug) {
	var accessLogfile = fs.createWriteStream('access.log', {flags: 'a'});
	app.use(logger({stream: accessLogfile}));
	var errorLogfile = fs.createWriteStream('error.log', {flags: 'a'});
} else {
	app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(expressValidator()); 
app.use(cookieParser());

// 设置会话
app.use(session({
	secret: 'my git stars',
  cookie: { maxAge: maxAge }
}));

app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

// custom middleware
// 用户认证中间件
// 有会话的判断isAdmin，否则读取request cookie判断，next
app.use(require('./middlewares/conf').auth_user);

// helper function
app.use(function (req, res, next) {
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	res.locals.user = req.session.user;
	next();
});

// github oauth
app.use(passport.initialize());
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(new GitHubStrategy(config.GITHUB_OAUTH, githubStrategyMiddleware));

// 路由 
var routes = require('./routes');
routes(app);

/// error handlers
if (!config.debug) {
	app.use(function (err, req, res, next) {
		var meta = '[' + moment(new Date()).format('LLL') + '] ' + req.url + '\n';
		errorLogfile.write(meta + err.stack + '\n');
		next();
	});
}

// 404
app.use(function (req, res) {
	res.redirect('/404');
});

// 禁止被加载自启动
// 这个语句的功能是判断当前模块是不是由其他模块调用的
// 如果不是,说明它是直接启动的,此时启动调试服务器;
// 如果是,则不自动启动服务器。
// 经过这样的修改,以后直接调用 node app.js 服务器会直接运行,
// 但在其他模块中调用require('./app') 则不会自动 启动,需要再显式地调用listen()函数。
if (!module.parent) {
	var port = Number(process.env.PORT || config.port);
	app.listen(port, function () {
		console.log('-----------------------------------------------------');
		console.log(config.name);
		console.log("Express server listening on port %d in %s mode", port, app.settings.env);
  	console.log("You can debug your app with http://" + config.host);
		console.log('-----------------------------------------------------');
	});
}

module.exports = app;
