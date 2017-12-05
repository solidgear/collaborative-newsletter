/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */

var constants = require('../../tools/constants');
var utils = require('../../tools/utils');
var users = require('./users');

exports.loadRoutes = function(app) {
    app.get(constants.API_PATH + constants.API_VERSION + '/users/me', utils.defaultAuthentication(), users.getUserInfo);
};
