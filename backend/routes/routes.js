/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */

var bodyParser = require('body-parser');
var cors = require('cors');
var config = require('../config.json');
var utils = require('../tools/utils');


// Create the app and listen for API requests
exports.assignRoutes = function (app) {
    var corsOptions = {
        origin: true,
        credentials: true
    };
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    //include users module
    if (utils.isUsersModuleActive()) {
        var userRoutes = require('../api/users/users_routes');
        userRoutes.loadRoutes(app);
    }


    //include auth module
    if (utils.isAuthModuleActive()) {
        var authRoutes = require('../api/auth/auth_routes');
        authRoutes.loadRoutes(app);
    }

    //include feeds module
    if (config.MODULES.FEEDS) {
        var rssRoutes = require('../api/feeds/feeds_routes');
        rssRoutes.loadRoutes(app);
    }
};
