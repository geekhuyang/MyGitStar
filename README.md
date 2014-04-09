## 安装

git clone

	git clone git@github.com:Sidong/MyGitStar.git

首先确保机子已经安装了 `node` ，可通过 `homebrew` 安装。  

	sudo brew install node

进入根目录，通过node包管理(npm)工具安装所有需要的第三方模块。  

	npm --registry=http://r.cnpmjs.org install

安装 `mongodb`。下载 [Download](http://www.mongodb.org/downloads)

运行 `mongodb`，指定路径

	mongod --dbpath=/Users/stone/data/someDB

##build

build依赖 `grunt`，先安装 `grunt` cli

	npm install -g grunt-cli

build命令

	grunt build

后台运行watch监视

	grunt watch &

## 启动

将 `config.default.js` 改为 `config.js`，对配置文件里 `GITHUB_OAUTH` 填写为从Github申请的clientID/clientSecret/callbackURL

	node app.js

或者

	node cluster.js

## 目录树

	.
	├── Gruntfile.js // Grunt 配置
	├── Procfile // Heroku 设置
	├── README.md // doc
	├── access.log // log
	├── app.js // 主程序
	├── cluster.js // 守护程序
	├── config.js // 全局配置文件
	├── data // data文件夹存放从github api读取的数据，用于分析
	│   ├── Sample-stars.json // star样本
	│   ├── Sidong-info.json // github用户信息样本
	│   └── readme.js // readme api 返回数据样本
	├── dbControl.js // 无作用，测试模块用
	├── error.log // log
	├── history.md // history
	├── lib // 自己定义的库
	│   ├── myGit.js // 获取github数据
	│   └── util.js // 格式化日期输出
	├── middlewares // 中间件
	│   ├── conf.js
	│   └── github_strategy.js
	├── models // 数据库模型
	│   ├── Owner.js // owner
	│   ├── Star.js // star
	│   ├── StarItem.js // star item
	│   ├── User.js // user
	│   └── index.js // 入口
	├── node_modules // 所有需要的安装的第三方模块存放目录
	├── package.json // 包说明
	├── proxy // 代理，通过导入模型，操作数据库
	│   ├── StarItem.js
	│   ├── User.js
	│   └── index.js
	├── public // public静态文件，debug模式下加载本地文件，非debug模式下加载cdn文件(jquery, bootstrap, font-awesome)
	│   ├── images
	│   ├── javascripts
	│   └── stylesheets
	├── routes // 路由
	│   ├── github.js // 有关github认证的所有路由
	│   ├── index.js // 入口
	│   ├── mystars.js // 有关管理star的所有路由
	│   ├── sign.js // 有关登录/~~注册~~的所有路由
	│   ├── site.js // 站点路由，只有首页
	│   └── user.js // 只有用户设置页面路由
	├── services
	│   └── mail.js // 邮件模块(去掉注册模块，暂时未用到)
	└── views // HTML模板，layout.jade是所有都会继承的，包含head，导航，footer
	    ├── index.jade // 首页
	    ├── layout.jade // layout
	    ├── mystars.jade // 我的星星页面
	    ├── readme.jade // readme页面
	    ├── setting.jade // 设置页面
	    └── signin.jade // 登录页面

## TODO

1. 添加readme，并用合适的方法呈现
	* 路由规则 /readme?author=Sidong&repo=my-impress
2. 增加admin功能
	* 查看用户/用户数量/站点数据
3. 修改数据库，将star和owner schema内嵌到staritem中，建立索引
4. 添加测试
5. 添加 to-read 功能？或者邮箱提醒功能？
6. 快速分类

## history

### 0.2.2 / 2014-04-08

1. 添加about页面
2. 增加404页面
3. 减少tags功能
4. 添加readme雏形
5. 去除`delete`按钮及其功能，for每次更新之后，delete的项目会重新添加
6. 去除`从Github更新`按钮，更改为每次登陆`mystar`，服务端自动从Github更新

### 0.2.1 / 2014-04-07

1. 添加starItem字段order，表示某个star的先后顺序，github api返回star的顺序就是用户star时间的顺序，最先返回的是最后star的
2. 根据新添加的字段order，提供根据star时间排序功能

### 0.2.0 / 2014-04-06

1. 申请github oauth
	* Client ID
	* Client Secret
	* Client CallbackUrl
2. 添加github oauth
	* 通过github认证的账号
		* 无需密码
		* 会话
3. 砍掉注册功能
4. 修改登录
5. 最终只实现通过Github Oauth认证
6. 专注于管理star模块

### 0.1.1 / 2014-04-04

1. 改动
	* 部署到heroku
	* 数据库查询默认按star数目顺序输出repo
	* 增加Grunt
		* jshint
		* uglify
		* autoprefixer
		* cssmin
		* watch
	* 增加 `cluster.js`
	* 去除starItem模型打分属性
	* 去除打分功能
	* 添加响应式设计
	* 添加bootstrap/font-awesome/jquery cdn

### 0.1.0 / 2014-04-03

第一个版本，大致完成以下功能

1. 站点
	* 首页
	* 登录页面
	* 注册页面
2. 用户管理
	* 用户注册
	* 发送邮箱激活链接
	* 激活账号
	* 用户登录
	* 登录窗口点击忘记密码，输入注册邮箱，发送邮箱密码重置链接
	* 链接重置密码
	* 登录后，用户可设置个人数据
	* 登录后，用户可重置个人密码
	* 用户退出
3. star管理
	* star管理基本界面
	* 设置Github账号
	* 从Github读取star数据
	* 从Github更新star数据
	* 用户为star数据分类
	* 提供添加分类、备注、标签、打分四个管理star的基本功能
	* ajax提交分类、备注、标签、打分修改
	* 根据star量排序
	* 显示语言统计
	* 通过字符编码转id的方法，允许以各种字符命名分类
	* 删除某个star
4. star界面
	* 移动在某个star项目，显示备注
5. 安全
	* 限制用户名长度(3~20)、格式([0-9A-Za-z])
	* 邮箱格式
	* 密码长度(3~20)
6. 其他
	* 从Github更新只会添加和更新，不会删除已经unstarred的
