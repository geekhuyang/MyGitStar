var Schema = require('mongoose').Schema;
var ObjectId = Schema.ObjectId;

// StarItem模型
var StarItemSchema = new Schema({
	user_id: { type: ObjectId, index: true }, // 用户 id
	update_at: { type: Date, default: Date.now }, // 更新时间
	order: { type: Number }, // 创建顺序，根据github api返回的顺序，代表用户加星动作的顺序

	// 导入模型
	star: { type: {} },
	owner: { type: {} },

	// 自定义数据
	remark: { type: String, default: '无备注' }, // 备注
	category: { type: String, default: '未分类'}, // 分类
	// tags: { type: [String], default: [] }, // 标签组
});

// StarItemSchema.index({ first: 1, last: -1 })

exports.StarItemSchema = StarItemSchema;
