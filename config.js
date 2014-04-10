// 配置文件
var path = require('path');
var pkg = require('./package.json');

var config = {
  name: 'My Git Star',

  // local 测试模式，如果部署到heroku，将这一片注释，下面一片取消注释
  // debug: true, // 开启debug
  // host: 'http://127.0.0.1:5000', // 本地host
  // port: 5000,
  // db: 'mongodb://127.0.0.1/test7', // 数据库
  // GITHUB_OAUTH: { // github oauth
  //   clientID: '5f2512ab33afd69305b1',
  //   clientSecret: '149459d502cf8efed5b9caa578d5f14e63def794',
  //   callbackURL: 'http://127.0.0.1:5000/auth/github/callback',
  // },

  // production 模式
  // debug: false, // 关闭debug
  // host: 'http://mygitstar.herokuapp.com',
  // port: 5000,
  // db: 'mongodb://mygitstar:sisi6612683@oceanic.mongohq.com:10010/mygitstar',
  // GITHUB_OAUTH: { // github oauth
  //   clientID: '9461e398cdc91fe50e90',
  //   clientSecret: 'e11499cad344c3fa4b801a0949ada87c9d9a9e1e',
  //   callbackURL: 'http://mygitstar.herokuapp.com/auth/github/callback',
  // },

  // // production 模式 xxooxx app
  debug: false, // 关闭debug
  host: 'http://xxooxx.herokuapp.com',
  port: 5000,
  db: 'mongodb://mygitstar:sisi6612683@oceanic.mongohq.com:10010/mygitstar',
  // db: 'mongodb://admin:admin@oceanic.mongohq.com:10053/xxooxx',
  GITHUB_OAUTH: { // github oauth
    clientID: '42a442ef951d2bd52f45',
    clientSecret: '5839ecc6563c7dc474f7c303cfae4346ae0fc2dd',
    callbackURL: 'http://xxooxx.herokuapp.com/auth/github/callback',
  },

  hostname: 'herokuapp.com',
  google_tracker_id: 'UA-49713351-1',

  session_secret: 'my_git_star', // session secret
  auth_cookie_name: 'my_git_star', // cookie name
  maxAge: 3600000 * 24 * 30, // cookie 有效期

  admins: { Sidong: true, jackyzh: true }, // admin 管理员账号

  // // mail SMTP
  // mail_opts: {
  //   host: 'smtp.qq.com',
  //   port: 25,
  //   auth: {
  //     user: 'stonestyle@qq.com',
  //     pass: 'xxx'
  //   }
  // },
};

module.exports = config;
module.exports.config = config;
