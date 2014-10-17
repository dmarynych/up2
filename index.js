var Repo = require('./models/Repo'),
    User = require('./models/User'),

    _ = require('lodash');

var up2 = {
    /**
     * Функция получает репозитории из базы, отсортированные по времени последней проверки
     *
     * @param limit - количество
     * @param cb
     */
    getRepos: function(limit, cb) {
        Repo
            .find()
            .sort({ versionCheckTime: 'asc'})
            .limit(limit)
            .exec(cb);
    },

    addRepo: function(repoData, cb) {
        new Repo(repoData).save(function(err, data) {
            cb(err, repoData);
        });
    },



    getRepo: function(repoData, cb) {
        Repo.find(repoData, cb);
    },

    addRelease: function(repoId, version, releaseDate, cb){
        Repo.findById(repoId, function(err, repo) {
            repo.releases.push({
                name: version,
                releaseDate: releaseDate
            });
            repo.save(cb);
        });

    },

    updateRepo: function(repoId, data, cb) {
        Repo.findById(repoId, function(err, repo) {
            repo.update(data, cb);
        });
    },


    getUsers: function(cb) {
        User
            .find()
            .exec(cb);
    },

    addStarredRepo: function(userId, repoUser, repoName, cb) {
        User.findById(userId, function(err, userData) {
            userData.starred.push(repoUser +'/'+ repoName);
            userData.save(cb);
        });
    },

    getUserStarred: function(id, cb) {
        User.findById(id, function(err, userData) {
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

        feed = _.sortBy(feed, 'releaseDate');
        console.log(feed);
        return feed;
    }




};


module.exports = up2;