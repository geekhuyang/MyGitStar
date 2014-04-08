// var Schema = require('mongoose').Schema;

// Owner属性
var OwnerProperties = {
	id: { type: Number }, // 作者 id
	login: { type: String }, // 作者 info url
	avatar_url: { type: String }, // 作者 avatar
	url: { type: String }, // 作者 id
	html_url: { type: String }, // 作者 github url
};

// Owner模型
// var OwnerSchema = new Schema({
//   id: { type: Number }, // 作者 id
//   login: { type: String }, // 作者 info url
//   avatar_url: { type: String }, // 作者 avatar
//   url: { type: String }, // 作者 id
//   html_url: { type: String }, // 作者 github url
// });

// exports.OwnerSchema = OwnerSchema;
exports.OwnerProperties = OwnerProperties;
