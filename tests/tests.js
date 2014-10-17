var expect = require("expect.js");
var up2 = require("../index");
var mongoose = require('mongoose');

describe('up2', function(){

    mongoose.models = {};
    mongoose.modelSchemas = {};

    var repos = [
        {
            name: "a",
            user: "b",
            releases: [
                {
                    name: "1.0.2",
                    releaseDate: 1380567267000
                },
                {
                    name: "1.1.0",
                    releaseDate: 1383623170000
                }
            ]
        },
        {
            name: "a1",
            user: "b1",
            releases: [
                {
                    name: "13.0.7",
                    releaseDate: 1380567265000
                }
            ]
        }
    ];
    var feed = [
        {
            name: "a1",
            user: "b1",
            version: "13.0.7",
            releaseDate: 1380567265000
        },

        {
            name: "a",
            user: "b",
            version: "1.0.2",
            releaseDate: 1380567267000
        },

        {
            name: "a",
            user: "b",
            version: "1.1.0",
            releaseDate: 1383623170000
        }
    ];



    it('should parse repos to feed', function() {
        var gotFeed = up2.reposToFeed(repos);

        expect(gotFeed).to.eql(feed);
    });

});