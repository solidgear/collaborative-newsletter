/**
 * Created by dvicente@solidgear.es on 18/08/2017
 */

var assert = require('chai').assert;
var expect = require('chai').expect;
var usersDomain = require('../../../domain/users/users');
var permissions = require('../../../tools/permissions');


var createTestUsers = function(num, validated=true) {
    var users = [];
    var userPromises = [];
    var userPromise;
    var username, password, name;
    // Generate the users with random texts to not raise errors because of same username or email
    for(var index = 0; index < num; index++) {
        username = password = name = Math.random().toString(36).substring(7);
        userPromise = usersDomain.createUser(username, password, name, username + "@testmail.com", permissions.roles.USER, null, validated)
        userPromises.push(userPromise);
    }

    return Promise.all(userPromises)
    .then(users => {
        return users;
    });
}


describe('Users', function () {

    describe('Create', function () {
        var userId;

        after(function() {
            return usersDomain.removeUser(userId);
        });

        it('Create one user', function () {
            var username = password = name = Math.random().toString(36).substring(7);
            return usersDomain.createUser(username, password, name, username + "@testmail.com", permissions.roles.USER)
            .then(userCreated => {
                userId = userCreated._id;
            });
        })
    });

        
    describe('Delete', function () {
        var userId;

        before(function() {
            return createTestUsers(1)
            .then(usersCreated => {
                userId = usersCreated[0]._id;
            });
        });

        it('Delete one user', function () {
            return usersDomain.removeUser(userId);
        })
    });


    describe('Get', function () {
        var userIds, users;
        var NUM_USERS_TEST = 5;

        before(function () {
            this.timeout(5000);
            return createTestUsers(NUM_USERS_TEST)
            .then(usersCreated => {
                users = usersCreated;
                userIds = usersCreated.map(userCreated => {
                    return userCreated._id;
                });
            });
        })

        after(function (done) {
            var numRemoved = 0;
            for(var userId of userIds) {
                usersDomain.removeUser(userId)
                .then(() => {
                    if(++numRemoved === userIds.length) {
                        done();
                    }
                });
            }
        })

        it('Get users by id', function () {
            return usersDomain.getUserById(users[0]._id)
            .then(user => {
                assert.equal(user.username, users[0].username);
                assert.equal(user._id.toString(), users[0]._id.toString());
            });
        });

        it('Get user by Username', function () {
            return usersDomain.getUserByUsername(users[0].username)
            .then(user => {
                assert.equal(user.username, users[0].username);
            });
        });

        it('Get user by email or username', function () {
            return usersDomain.getUserByEmailOrUsername('', users[0].username)
            .then(user => {
                assert.equal(user.username, users[0].username);
                return usersDomain.getUserByEmailOrUsername(users[0].email, '');
            })
            .then(user => {
                assert.equal(user.email, users[0].email);
            });
        });
    })

})