var mongoose = require('mongoose');


var RepoSchema = mongoose.Schema({
    "avatar": String,
    "currentVersion":  String,
    "description":  String,
    "isActive": Boolean,
    "language":  String,
    "name":  String,
    "releaseTime": Number,
    "stars": Number,
    "updateTime": Number,
    "user":  String,
    "versionCheckTime": Number,
    "releases": Array
});


var Repo = mongoose.model('Repo', RepoSchema);

module.exports = Repo;