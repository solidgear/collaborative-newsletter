/**
 * Created by dvicente@solidgear.es on 09/06/2016
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
