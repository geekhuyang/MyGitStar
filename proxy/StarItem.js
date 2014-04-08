var models = require('../models');
var StarItem = models.StarItem;

var StarProperties = models.StarProperties;
var OwnerProperties = models.OwnerProperties;

// underscore 库
var _ = require('underscore');

/**
 * 新建一个star条目
 * Callback:
 * - err, 数据库异常
 * @param {Schema.ObjectId} user_id 用户id
 * @param {Schema.ObjectId} belong_id 集合id
 * @param {String} datas 从gihtub获取的某个star数据 包含star和owner
 * @param {Function} callback 回调函数
 */
var newAndSave = function (user_id, datas, order, callback) {
	"use strict";
	var item = new StarItem();
	item.user_id = user_id;
	item.star = copyProperties(datas, StarProperties);
	item.owner = copyProperties(datas.owner, OwnerProperties);
	item.order = order;
	
	item.save(callback);
};
exports.newAndSave = newAndSave;

/**
 * 根据用户ID，查找StarItem组，根据star.stargazers_count有序输出
 * Callback:
 * - err, 数据库异常
 * - starItems, 集合组([] 或 [{..},{..},..])
 * @param {Schema.ObjectId} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getByUserId = function (id, callback) {
	"use strict";
	// 排序
	StarItem.find({user_id: id}, '', {sort: {'star.stargazers_count': 'desc'}}, callback);
};

/**
 * 根据用户ID/starID 查找StarItem
 * Callback:
 * - err, 数据库异常
 * - starItem, starItem(null 或 {..})
 * @param {Schema.ObjectId} userid 用户ID
 * @param {Schema.ObjectId} starid star ID
 * @param {Function} callback 回调函数
 */
var getByUserIdAndStarID = function (userid, starid, callback) {
	"use strict";
	StarItem.findOne({'user_id': userid, 'star.id': starid}, callback);
};
exports.getByUserIdAndStarID = getByUserIdAndStarID;

/**
 * 新建或者更新一个star条目
 * Callback:
 * - err, 数据库异常
 * @param {Schema.ObjectId} user_id 用户id
 * @param {Object} data 某个从github获取的starItem
 * @param {Function} callback 回调函数
 */
exports.updateOrSave = function (user_id, data, order, callback) {
	"use strict";
	// 先判断是否存在，不存在save，存在update
	getByUserIdAndStarID(user_id, data.id, function (err, starItem) {
		if (err) { return callback(err); }
		if (starItem) {
			// update
			starItem.star = copyProperties(data, StarProperties);
			starItem.owner = copyProperties(data.owner, OwnerProperties);
			starItem.order = order;
			starItem.save(callback);
		} else {
			// save
			newAndSave(user_id, data, order, callback);
		}
	});
};

// util
// 根据ref的属性复制src的同名属性的到空对象，并返回该对象
function copyProperties(src, ref) {
	"use strict";
	var keys = _.keys(ref);
	keys.unshift(src);
	var dst = _.pick.apply(_, keys);
	return dst;
}
