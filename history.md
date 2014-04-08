0.2.0 / 2014-04-06

### 申请github oauth

* Client ID
* Client Secret
* Client CallbackUrl

### 添加github oauth

* 通过github认证的账号
	* 无需密码
	* 会话
* 砍掉注册功能
* 修改登录
* 最终只实现通过Github Oauth认证
* 专注于管理star模块

### TODO

* 添加README.md，并用合适的方法呈现
	* 路由规则 /readme?author=Sidong&repo=my-impress

0.1.1 / 2014-04-04
-------------------

### 贡献者

|Github|比例|
|:-:|:-:|
|[Sidong](http://github.com/Sidong)|100%|

### 改动

* 部署到heroku
* 数据库查询默认按star数目顺序输出repo
* 增加Grunt
	* jshint
	* concat
	* uglify
	* autoprefixer
	* cssmin
	* watch
* 增加 `cluster.js`
* 去除starItem模型打分属性
* 去除打分功能
* 添加响应式设计
* 添加bootstrap/font-awesome/jquery cdn

### TODO

* 增加admin功能
	* 查看用户
	* 查看数据库
* 修改数据库，将star和owner schema内嵌到staritem中，建立索引

0.1.0 / 2014-04-03
-------------------

### 贡献者

|Github|比例|
|:-:|:-:|
|[Sidong](http://github.com/Sidong)|100%|

### 第一个版本，大致完成以下功能

* 站点
	* 首页
	* 登录页面
	* 注册页面
* 用户管理
	* 用户注册
	* 发送邮箱激活链接
	* 激活账号
	* 用户登录
	* 登录窗口点击忘记密码，输入注册邮箱，发送邮箱密码重置链接
	* 链接重置密码
	* 登录后，用户可设置个人数据
	* 登录后，用户可重置个人密码
	* 用户退出
* star管理
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
* star界面
	* 移动在某个star项目，显示备注
* 安全
	* 限制用户名长度(3~20)、格式([0-9A-Za-z])
	* 邮箱格式
	* 密码长度(3~20)
* 其他
	* 从Github更新只会添加和更新，不会删除已经unstarred的

### 已修复bug

* 分类名

### TODO

* 添加测试
* 修复已知bug
	* ~~show sign in 和 show sign up 两个flash失效~~
	* 若有用户登录 终端输出undefined的值，一直找不到从何而来
* 添加 to-read 功能？或者邮箱提醒功能？
