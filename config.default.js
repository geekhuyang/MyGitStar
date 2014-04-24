// 配置文件
var path = require('path');
var pkg = require('./package.json');

var config = {
  name: 'My Git Star',
  hostname: 'mygitstar.herokuapp.com',

  // local 测试模式
  debug: true, // 开启debug
  host: '127.0.0.1:5000', // 本地host
  port: 5000,
  db: 'mongodb://127.0.0.1/mystar', // 本地数据库

  google_tracker_id: '', // google tracker id
	// github oauth
	// 请将下面修改为github注册的clientID/clientSecret/callbackURL
  GITHUB_OAUTH: {
    clientID: 'local mode',
    clientSecret: 'local mode',
    callbackURL: 'local mode',
  },

  session_secret: 'my_git_star', // session secret
  auth_cookie_name: 'my_git_star', // cookie name
  maxAge: 3600000 * 24 * 30, // cookie 有效期
  admins: { xxx: true } // admin 管理员账号

  // mail SMTP
  mail_opts: {
    host: 'smtp.qq.com',
    port: 25,
    auth: {
      user: 'xx@xx.com',
      pass: 'xxxx'
    }
  },
  log_mail: 'xx@xx.com',
};

module.exports = config;
module.exports.config = config;
