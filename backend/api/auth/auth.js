/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
'use strict'

var utils = require('../../tools/utils');
var logger = require('../../tools/logger');
var refreshTokensDomain = require('../../domain/auth/refreshTokens');
var usersDomain = require('../../domain/users/users');

//Basic auth
exports.authBasic = function(req, res, next) {
    var user = req.user
    delete user.password
    var token = utils.createJWT(user)
    req.session.save(function (err) {
        if (err) {
            return next(err)
        }
        
        //Return refresh token if exists or create a new one
        refreshTokensDomain.getRefreshTokenOrCreate(user._id)
        .then(refreshToken => {
            res.json({token: 'JWT ' + token, refreshToken: refreshToken.refreshToken});
        })
        .catch(error => {
            return next(error);
        });
    });
}

exports.logout = function (req, res, next) {
    req.logout()
    res.sendStatus(200)
}



// JWT
exports.generateToken = function (req, res, next) {
    if(req.user.disabled) {
        return res.sendStatus(401)
    }
    var token = utils.createJWT(req.user)
    res.json({token: 'JWT ' + token})
}


// Make sure the refresh token exists and get user that belongs to
exports.validateRefreshToken = function(req, res, next) {  
    var refreshToken = req.body.refreshToken;
    if(!refreshToken) {
        return res.status(400).send();
    }
    refreshTokensDomain.getRefreshToken(refreshToken)
    .then(refreshToken => {
        if (!refreshToken) {
            return res.sendStatus(401);
        }
        
        usersDomain.getUserById(refreshToken.userId)
        .then(user => {
            req.user = user;
            return next();
        })
        .catch(error => {
            logger.error("Error validating refresh token: " + error);
            return next(error);
        });
    })
    .catch(error => {
        return next(error);
    });
}