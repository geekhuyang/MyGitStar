// site
// 首页
exports.index = function (req, res) {
	"use strict";
	res.render('index', {
		// 指定active菜单项
		active: 'home',
		// 指定脚本文件名
		script: 'main.min.js'
	});
};

// 404
exports.site404 = function (req, res) {
	"use strict";
	res.render('404', {
		script: '',
		active: ''
	});
};

// about
exports.about = function (req, res) {
	"use strict";
	res.render('about', {
		// 指定active菜单项
		active: 'about',
		// 指定脚本文件名
		script: 'main.min.js'
	});
};
