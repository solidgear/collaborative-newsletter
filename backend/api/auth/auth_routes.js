/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */

 var constants = require('../../tools/constants');
var passport = require('passport');
var auth = require('./auth');

 exports.loadRoutes = function(app) {
    // AUTH BASIC  (and jwt)
    app.post(constants.API_PATH + constants.API_VERSION + '/auth/basic', passport.authenticate('local'), auth.authBasic);
    app.post(constants.API_PATH + constants.API_VERSION + '/logout', auth.logout);
    
    // JWT
    app.post(constants.API_PATH + constants.API_VERSION + '/token', auth.validateRefreshToken, auth.generateToken);
 }