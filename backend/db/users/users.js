/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */

'use strict'

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var constants = require('../../tools/constants');
var ObjectID = require('mongodb').ObjectID;
var logger = require('../../tools/logger');
var utils = require('../../tools/utils');

// Create a Mongoose schema
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    name: String,
    role: String,
    validationCode: {type: String, default: ""},
    accountValidated: {type: Boolean, default: false},
    deleted: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
    twitterUsername: String,
    updated_at: { type: Date, required: true, default: utils.getCurrentDateFormatted },
    created_at: { type: Date, required: true, default: utils.getCurrentDateFormatted }
})

// Note that Mongoose middleware will be executed as usual
UserSchema.pre('save', function (next) {
    presavePassword(this, next);
})

//encrypt the password before saving the user
var presavePassword = function(user, next) {
    if(!user.password) {
        return next();
    }

    bcrypt.hash(user.password, constants.BCRYPT_SALT_ROUNDS)
        .then(function(encryptedPassword) {
            user.password = encryptedPassword;
            return next();
        })
        .catch(function(error){
            logger.error("Error saving user: ");
            logger.error(error);
            return next();
        })
}

// Register the schema
var User = mongoose.model('user', UserSchema);
exports.User = User;


var formatUser = function(user) {
    return {
        _id: user._id,
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name,
        role: user.role,
        validationCode: user.validationCode,
        accountValidated: user.accountValidated,
        deleted: user.deleted,
        disabled: user.disabled,
        twitterUsername: user.twitterUsername,
        updated_at: user.updated_at,
        created_at: user.created_at
    };
}


exports.getUserByEmailOrUsername = function (email, username) {
    var query = {'$or': [ {'email': email}, {'username': username} ] }
    return User.findOne(query).lean(true).exec();
}

exports.getUserByUsername = function (username) {
    var query = {'username': username};
    return User.findOne(query).lean(true).exec();
}


exports.createUser = function(username, password, name, email, role, validationCode, accountValidated, twitterUsername) {
    var userData = {};
    if(username !== undefined) {
        userData.username = username;
    }
    
    if(password !== undefined) {
        userData.password = password;
    }

    if(name !== undefined) {
        userData.name = name;
    }
    
    if(email !== undefined) {
        userData.email = email;
    }
    
    if(role !== undefined) {
        userData.role = role;
    }
    
    if(validationCode !== undefined) {
        userData.validationCode = validationCode;
    }

    if(accountValidated !== undefined) {
        userData.accountValidated = accountValidated;
    }

    if(twitterUsername !== undefined) {
        userData.twitterUsername = twitterUsername;
    }

    var user = new User(userData);
    return user.save()
    .then(createdUser => {
        return formatUser(createdUser);
    });
}


// remove user document from collection
exports.removeUser = function (userId) {
    var query = { '_id': userId };
    return User.remove(query).exec();
}


exports.getUserById = function (userId) {
    var query = {'_id': userId};
    return User.findOne(query).lean(true).exec();
}