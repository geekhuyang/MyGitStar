// var Schema = require('mongoose').Schema;

// Star属性
var StarProperties = {
	id: { type: Number }, // 项目 id
	name: { type: String }, // 项目名字
	full_name: { type: String }, // 项目全名
	language: { type: String }, // 语言
	html_url: { type: String }, // Github 网址
	description: { type: String }, // 描述
	languages_url: { type: String }, // 语言比例 api url
	created_at: { type: Date }, // 创建时间
	updated_at: { type: Date }, // 更新时间
	pushed_at: { type: Date }, // push时间
	git_url: { type: String }, // git url
	ssh_url: { type: String }, // ssh url
	clone_url: { type: String }, // git clone url
	homepage: { type: String }, // 项目主页
	size: { type: Number }, // 大小
	stargazers_count: { type: Number }, // star数目
	watchers_count: { type: Number }, // watch数目
	forks_count: { type: Number }, // fork数目
};

// Star模型
// var StarSchema = new Schema({
//   id: { type: Number }, // 项目 id
//   name: { type: String }, // 项目名字
//   full_name: { type: String }, // 项目全名
//   language: { type: String }, // 语言
//   html_url: { type: String }, // Github 网址
//   description: { type: String }, // 描述
//   languages_url: { type: String }, // 语言比例 api url
//   created_at: { type: Date }, // 创建时间
//   updated_at: { type: Date }, // 更新时间
//   pushed_at: { type: Date }, // push时间
//   git_url: { type: String }, // git url
//   ssh_url: { type: String }, // ssh url
//   clone_url: { type: String }, // git clone url
//   homepage: { type: String }, // 项目主页
//   size: { type: Number }, // 大小
//   stargazers_count: { type: Number }, // star数目
//   watchers_count: { type: Number }, // watch数目
//   forks_count: { type: Number }, // fork数目
// });

// exports.StarSchema = StarSchema;
exports.StarProperties = StarProperties;
