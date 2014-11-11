var RepoSchema = require('./schemas/Repo'),
    UserSchema = require('./schemas/User'),
    ListSchema = require('./schemas/List'),

    _ = require('lodash'),
    passportLocalMongoose = require('passport-local-mongoose');


var up2 = {
    models: {},

    init: function(mongoose) {
        var UserSchema;

        this.mongoose = mongoose;

        this.models.Repo = mongoose.model('Repo', new mongoose.Schema(RepoSchema));
        this.models.List = mongoose.model('List', new mongoose.Schema(ListSchema));

        this.models.User = mongoose.model('User', new mongoose.Schema(UserSchema)
            .plugin(passportLocalMongoose));
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



    getRepo: function(criteria, cb) {
        up2.models.Repo.find(criteria, cb);
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

    getUserLists: function(criteria, cb) {
        up2.models.List.find(criteria, cb);
    },
    addList: function(data, cb){
        var list = new up2.models.List(data);
        list.save(cb);
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
