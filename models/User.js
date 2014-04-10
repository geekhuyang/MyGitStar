var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// User模型
var UserSchema = new Schema({
	name: { type: String, index: true },
	email: { type: String },
	avatar_url: { type: String },
	url: { type: String },
	githubId: { type: String, index: true },
	githubUsername: { type: String },
	star_items: { type: Number, default: 0 },
	
	weibo: { type: String },

	create_at: { type: Date, default: Date.now },
	update_at: { type: Date },
	visit: { type: Number, default: 1 }
});

exports.UserSchema = UserSchema;
