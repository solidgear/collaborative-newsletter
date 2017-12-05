/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
'use strict';

var jwt = require('jsonwebtoken');
var moment = require('moment-timezone');
var passport = require('passport');
var mkdirp = require('mkdirp');
var permsRoles = require('./permissions');
var config = require('../config.json');
var logger = require('../tools/logger');



exports.getCurrentDateFormatted = function() {
    return moment.utc().toISOString();
};


exports.validatePermission = function (permission) {
    return function (req, res, next) {
        // check if the user has the permission
        if (req.user) {
            var role = req.user.role;
            var permissions = permsRoles.getPermissionsOfRole(role);
            if (permissions && permissions.indexOf(permission) >= 0) {
                // permissions are ok, then allow
                return next();
            }
        }

        // missing needed permissions, then 401
        // Add foo realm just so android can read 401 data
        res.setHeader('WWW-Authenticate', 'Basic realm="FOOREALM"');
        res.status(401).send({'message': 'Unauthorized'});
    };
};

// Implements a simple algorithm in order to offer a default authentication
// for some api methods
exports.defaultAuthentication = function () {
    var defaultAuthentication = null;
    if (config.JWT_STRATEGY) {
        defaultAuthentication = 'jwt';
    } else if (config.BASIC_AUTH_STRATEGY) {
        defaultAuthentication = 'local';
    } 

    var callback = passport.authenticate(defaultAuthentication);
    return callback;
};



// Generate a new JWT with user info and expire time
exports.createJWT = function(user) {
    var token = jwt.sign(user, config.secret, { expiresIn: config.TOKEN_TIME });
    return token;
};



//Make sure password is strong enough
exports.checkPwdStrength = function(str) {
    if (str.length < 6) {
        return "PASSWORD_AT_LEAST_6_CHARACTERS_LONG";
    } else if (str.search(/\d/) === -1) {
        return "PASSWORD_AT_LEAST_ONE_NUMBER";
    } else if (str.search(/[a-zA-Z]/) === -1) {
        return "PASSWORD_AT_LEAST_ONE_LETTER";
    } else if (str.search(/[^a-zA-Z0-9]/) !== -1) {
        return "PASSWORD_ONLY_CONTAIN_NUMBERS_AND_LETTERS";
    }
    return null;
};


exports.isUsersModuleActive = function() {
    // if users module or any of its dependent modules are active, it has to be loaded
    return (config.MODULES.USERS || config.MODULES.AUTH);
};


exports.isAuthModuleActive = function() {
    // if users module or any of its dependent modules are active, it has to be loaded
    return config.MODULES.AUTH;
};


exports.isFeedsModuleActive = function() {
    // if feed module or any of its dependent modules are active, it has to be loaded
    return config.MODULES.FEEDS;
};


exports.createFolder = function(foldername) {
    mkdirp(foldername, function (err) {
        if (err) {
            logger.error(err);
        }
        else {
            logger.info("The folder: " + foldername + " was created");
        }
    });
};


// calculate date for a year and a week number
exports.firstDayOfWeek = function(week, year) { 
    if (year === null) {
        year = (new Date()).getFullYear();
    }

    var date = firstWeekOfYear(year),
        weekTime = weeksToMilliseconds(week),
        targetTime = date.getTime() + weekTime;

    return new Date(date.setTime(targetTime));
};


function weeksToMilliseconds(weeks) {
    return 1000 * 60 * 60 * 24 * 7 * (weeks - 1);
}


function firstWeekOfYear(year) {
    var date = new Date();
    date = firstDayOfYear(date, year);
    date = firstWeekday(date);
    return date;
}

function firstDayOfYear(date, year) {
    date.setYear(year);
    date.setDate(1);
    date.setMonth(0);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

/**
 * Sets the given date as the first day of week of the first week of year.
 */
function firstWeekday(firstOfJanuaryDate) {
    // 0 correspond au dimanche et 6 correspond au samedi.
    var FIRST_DAY_OF_WEEK = 1; // Monday, according to iso8601
    var WEEK_LENGTH = 7; // 7 days per week
    var day = firstOfJanuaryDate.getDay();
    day = (day === 0) ? 7 : day; // make the days monday-sunday equals to 1-7 instead of 0-6
    var dayOffset = -day + FIRST_DAY_OF_WEEK; // dayOffset will correct the date in order to get a Monday
    if (WEEK_LENGTH - day + 1 < 4) {
        // the current week has not the minimum 4 days required by iso 8601 => add one week
        dayOffset += WEEK_LENGTH;
    }
    return new Date(firstOfJanuaryDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
}


/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items The array containing the items.
 */
exports.shuffle = function(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}