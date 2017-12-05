/**
 * Created by dvicente@solidgear.es on 01/12/2017
 */

var constants = require('../../tools/constants');
var utils = require('../../tools/utils');
var users = require('./users');

exports.loadRoutes = function(app) {
    app.get(constants.API_PATH + constants.API_VERSION + '/users/me', utils.defaultAuthentication(), users.getUserInfo);
};
