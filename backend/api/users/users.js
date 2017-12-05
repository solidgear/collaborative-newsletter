/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
'use strict'

var usersDomain = require('../../domain/users/users');


exports.getUserInfo = function (req, res, next) {
    var user = req.user;
    usersDomain.getUserById(user._id)
    .then(user => {
        user.password = undefined;
        res.status(200).send(user)
    })
    .catch(error => {
        logger.error("Error getting user info: " + error);
        return res.status(403).send({'message': req.i18n.__('ERROR_GETTING_USER_INFO')});
    });
}