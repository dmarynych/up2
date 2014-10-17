var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    username: { type: String, default: '' },
    provider: { type: String, default: '' },
    hashed_password: { type: String, default: '' },
    salt: { type: String, default: '' },
    authToken: { type: String, default: '' },
    facebook: {},
    twitter: {},
    github: {},
    google: {},
    linkedin: {},
    starred: []
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);