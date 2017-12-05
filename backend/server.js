/**
 * Created by dvicente@solidgear.es on 09/06/2016
 */
'use strict'

var routes = require('./routes/routes');

var constants = require('./tools/constants');
var logger = require('./tools/logger');
var utils = require('./tools/utils');
var db_tools = require('./db/db_tools');
var schedule = require('node-schedule');
var express = require('express');
var helmet = require('helmet');
var passport = require('passport');
var bodyparser = require('body-parser');
var config = require('./config.json');
var app = express();
var I18n = require('i18n-2');
var moment = require('moment');
var bcrypt = require('bcryptjs');


db_tools.getDBConexion()
.then(() => {
    // initialize logs folder
    utils.createFolder("./logs");

    app.use(helmet());

    if(utils.isAuthModuleActive()) {
        loadAuthenticationStrategies();
    }

    // i18n
    I18n.expressBind(app, {
        locales: ['en', 'es'],
        directory: config.i18n_path + "/locales",
        defaultLocale: 'en',
        extension: ".json"
    });

    // configure app to use bodyParser()
    // this will let us get the data from a POST
    app.use(bodyparser.urlencoded({ extended: true }));
    app.use(bodyparser.json({limit: '10mb'}));

    app.use(passport.initialize())
    app.use(passport.session())

    routes.assignRoutes(app)

    app.listen(config.EXTERNAL_PORT)

    console.log('Server listening on port ' + config.EXTERNAL_PORT)
})





var loadAuthenticationStrategies = function() {
    var usersDomain = require('./domain/users/users');
    
    // this JWT impelmentation uses local strategy to create and return the JWT
    if (config.BASIC_AUTH_STRATEGY || config.JWT_STRATEGY) {
        var LocalStrategy = require('passport-local').Strategy
        passport.use(new LocalStrategy(
            function (username, password, done) {
                var checkPassword = function(password, user, callback) {
                    if (!user) {
                        return callback(null, false); 
                    }
                    bcrypt.compare(password, user.password)
                        .then(function(samePassword) {
                            if(!samePassword) {
                                return callback(null, false); 
                            }
                            delete user.password;
                            callback(null, user);
                            return;
                        });
                }

                usersDomain.getUserByEmailOrUsername(username, username)
                .then(user => {
                    if (!user || user.deleted) {
                        logger.debug("Incorrect username or email: " + username);
                        return done(false);
                    } else {
                        return checkPassword(password, user, done);
                    }
                })
                .catch(error => {
                    logger.error(error);
                    return done(false);
                });
            }
        ))
    }

    app.use(require('express-session')({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false
    }))

    passport.serializeUser(function (user, done) {
        done(null, user);
    })

    passport.deserializeUser(function (user, done) {
        done(null, user);
    })

    if (config.JWT_STRATEGY) {
        var JwtStrategy = require('passport-jwt').Strategy;
        var ExtractJwt = require('passport-jwt').ExtractJwt;
        var opts = {};
        // Setup JWT options
        opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
        opts.secretOrKey = config.secret;

        passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
            //If the token has expiration, raise unauthorized
            var expiration = moment(jwtPayload.exp * 1000);
            if(expiration.utc() < moment().utc()) {
                return done(null, false);
            }
            var user = jwtPayload;
            done(null, user);
        }))
    }
}
