/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */

var randtoken = require('rand-token');
var refreshTokensDB = require('../../db/auth/refreshTokens');
var config = require('../../config.json');


// Return the refresh token of the user if it exists, or create a new one if it does not
exports.getRefreshTokenOrCreate = function(userId, callback) {
    return getRefreshTokenByUserId(userId)
    .then(refreshToken => {
        if(refreshToken) {
            return refreshToken;
        }
        
        return createRefreshToken(userId);
    })
    .then(refreshToken => {
        return refreshToken;
    });
};


exports.getRefreshToken = function(refreshToken) {
    return refreshTokensDB.getRefreshToken(refreshToken);
}


var getRefreshTokenByUserId = exports.getRefreshTokenByUserId = function(userId) {
    return refreshTokensDB.getRefreshTokenByUserId(userId);
}


var createRefreshToken = exports.createRefreshToken = function(userId) {
    var refreshTokenString = randtoken.uid(config.TOKEN_LENGTH);
    return refreshTokensDB.createRefreshToken(refreshTokenString, userId);
}


exports.deleteRefreshToken = function(refreshTokenString) {
    return refreshTokensDB.deleteRefreshToken(refreshTokenString);
}

