var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// User模型
var UserSchema = new Schema({
	name: { type: String, index: true },
	email: { type: String, unique: true },
	avatar_url: { type: String },
	url: { type: String },
	githubId: { type: String, index: true },
	githubUsername: { type: String },
	
	location: { type: String },
	signature: { type: String },
	profile: { type: String },
	weibo: { type: String },

	create_at: { type: Date, default: Date.now },
	update_at: { type: Date }
});

exports.UserSchema = UserSchema;
