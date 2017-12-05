/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */

var mongoose = require('mongoose');

// Create a Mongoose schema
var RefreshTokenSchema = new mongoose.Schema({
    refreshToken: String,
    userId: { type: mongoose.Schema.Types.ObjectId, required: false}
})

// Register the schema
var RefreshToken = mongoose.model('refresh_token', RefreshTokenSchema)
exports.RefreshToken = RefreshToken

var formatRefreshToken = function(refreshToken) {
    return {
        _id: refreshToken._id,
        refreshToken: refreshToken.refreshToken,
        userId: refreshToken.userId
    };
}

exports.createRefreshToken = function(refreshTokenString, userId) {
    var refreshToken = new RefreshToken({refreshToken: refreshTokenString, userId: userId});
    return refreshToken.save()
    .then(refreshTokenCreated => {
        return formatRefreshToken(refreshTokenCreated);
    });
}


exports.getRefreshToken = function (refreshToken) {
    var query = {'refreshToken': refreshToken}
    return RefreshToken.findOne(query).lean(true).exec();
}


exports.getRefreshTokenByUserId = function (userId) {
    var query = {'userId': userId};
    return RefreshToken.findOne(query).lean(true).exec();
}


exports.deleteRefreshToken = function (refreshToken) {
    var query = { 'refreshToken': refreshToken };
    return RefreshToken.remove(query).exec();
}
