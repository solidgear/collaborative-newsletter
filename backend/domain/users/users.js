/**
 * Created by dvicente@solidgear.es on 17/08/2017
 */
var utils = require('../../tools/utils');
var logger = require('../../tools/logger');
var permsRoles = require('../../tools/permissions');
var usersDB = require('../../db/users/users');



var getUserByEmailOrUsername = exports.getUserByEmailOrUsername = function(email, username) {
    return usersDB.getUserByEmailOrUsername(email, username);
}

exports.getUserByUsername = function(username) {
    return usersDB.getUserByUsername(username);
}


var createUser = exports.createUser = function(username, password, name, email, role, validationCode, accountValidated, twitterUsername) {
    return getUserByEmailOrUsername(email, username)
    .then(user => {
        // To check if the user has been already registered
        if (user && user.password) {
            throw 'ERROR_USER_ALREADY_REGISTERED';
        }

        // Check password strengh unless it is ldap user
        var passwordError = utils.checkPwdStrength(password);
        if(passwordError) {
            throw passwordError;
        }

        return usersDB.createUser(username, password, name, email, role, validationCode, accountValidated, twitterUsername);
    })
    .then(userCreated => {
        delete userCreated.password;
        return userCreated;
    })
    .catch(error => {
        logger.error(error);
        throw 'ERROR_WRONG_USER';
    });
}


exports.getUserById = function(userId) {
    return usersDB.getUserById(userId);
}


// remove document from collection
exports.removeUser = function(userId) {
    return usersDB.removeUser(userId);
}

