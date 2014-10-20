var RepoSchema = require('./schemas/Repo'),
    UserSchema = require('./schemas/User'),

    _ = require('lodash');

var up2 = {
    models: {},

    init: function(mongoose) {
        this.mongoose = mongoose;

        this.models.Repo = mongoose.model('Repo', new mongoose.Schema(RepoSchema));

        var UserSchema =new mongoose.Schema(UserSchema);
        passportLocalMongoose = require('passport-local-mongoose');
        UserSchema.plugin(passportLocalMongoose);

        this.models.User = mongoose.model('User', UserSchema);
    },



    /**
     * Функция получает репозитории из базы, отсортированные по времени последней проверки
     *
     * @param limit - количество
     * @param cb
     */
    getRepos: function(limit, cb) {
        up2.models.Repo
            .find()
            .sort({ versionCheckTime: 'asc'})
            .limit(limit)
            .exec(cb);
    },

    addRepo: function(repoData, cb) {
        new up2.models.Repo(repoData).save(function(err, data) {
            cb(err, repoData);
        });
    },



    getRepo: function(repoData, cb) {
        up2.models.Repo.find(repoData, cb);
    },

    addRelease: function(repoId, version, releaseDate, cb){
        up2.models.Repo.findById(repoId, function(err, repo) {
            repo.releases.push({
                name: version,
                releaseDate: releaseDate
            });
            repo.save(cb);
        });

    },

    updateRepo: function(repoId, data, cb) {
        up2.models.Repo.findById(repoId, function(err, repo) {
            repo.update(data, cb);
        });
    },


    getUsers: function(cb) {
        up2.models.User
            .find()
            .exec(cb);
    },

    addStarredRepo: function(userId, repoUser, repoName, cb) {
        up2.models.User.findById(userId, function(err, userData) {
            userData.starred.push(repoUser +'/'+ repoName);
            userData.save(cb);
        });
    },

    getUserStarred: function(id, cb) {
        up2.models.User.findById(id, function(err, userData) {
            cb(err, userData.starred);
        });
    },



    reposToFeed: function(repos) {
        var feed = [];

        repos.forEach(function(repo) {

            repo.releases.forEach(function(release) {
                var fitem = _.clone(repo);
                fitem.version = release.name;
                fitem.releaseDate = release.releaseDate;
                delete fitem.releases;

                feed.push(fitem);
            });
        });

        feed = _.sortBy(feed, function(d) { return -d.releaseDate;});
        
        return feed;
    }




};


module.exports = up2;
