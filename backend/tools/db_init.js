var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var db_tools = require('../db/db_tools');

db_tools.getDBConexion()
.then(() => {
    var usersDomain = require('../domain/users/users');
    var feedsDomain = require('../domain/feeds/feeds');

    var createUser = function(userData) {
        var username = userData.username;
        var name = userData.name;
        var password = userData.password;
        var email = userData.email;
        var role = userData.role;
        var twitterUsername = userData.twitterUsername;

        return usersDomain.getUserByUsername(username)
        .then(user => {
            if(user) {
                error = 'User already in DB: ' + username;
                throw error;
            }
            return;
        })
        .then(result => {
            //Create user
            return usersDomain.createUser(username, password, name, email, role, null, true, twitterUsername);
        })
        .catch(error => {
            console.log(error);
        });
    };

    var userOwnerData = {username: 'owner', name: 'owner', password: 'ownerpassword1', twitterUsername: 'ownerTwitter', email: 'owner@mydomain.com', role: 'ADMIN'};


    // create feed for Bulletin
    var createFeed = function() {
        var feedName = 'Bulletin';
        // make sure feed does not exist yet
        return feedsDomain.getFeedByName(feedName)
        .then(feed => {
            if(feed) {
                error = 'Feed already exist: ' + feedName;
                throw error;
            }
            // find owner user to assign feed to him
            return usersDomain.getUserByUsername('owner');
        })
        .then(owner => {
            return feedsDomain.createFeed(feedName, owner._id, "Bulletin", "Every Monday, we send our newsletter subscribers a free round-up of latest technology trend news and must-reads. It's a curated digest made by SolidGear team members that enables you to stay updated while saving time", "", "", "", "", "", "", "", "es");
        })
        .then(() => {
            console.log('Bulletin feed created');
            return;
        })
        .catch(error => {
            console.log(error);
        });
    }

    //Create user owner of the feed, and feed for bulletin
    createUser(userOwnerData)
    .then(userOwner => {
        return createFeed();
    })
    .then(() => {
        var users = require('./users_init.json');
        var userPromises = [];
        users.forEach(function(userData) {
            userPromises.push(createUser(userData));
        }, this);

        //wait until all users are created and finish
        return Promise.all(userPromises);
    })
    .then(() => {
        process.exit();
    });

})


