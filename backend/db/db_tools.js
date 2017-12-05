/**
 * Created by dvicente on 01/08/2017
 */

'use strict'

var mongoose = require('mongoose');
var config = require('../config.json');
var logger = require('../tools/logger');

var db

exports.getDBConexion = function () {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        // database connect
        if (config.db_config.username !== '' && config.db_config.password !== ''){
            mongoose.connect('mongodb://' + config.db_config.username + ':' + config.db_config.password + '@' + config.db_config.host + ":" + config.db_config.port + "/" + config.db_config.db, {useMongoClient: true});
        } else {
            mongoose.connect('mongodb://' + config.db_config.host + ":" + config.db_config.port + "/" + config.db_config.db, {useMongoClient: true});
        }

        mongoose.Promise = global.Promise;
        db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function(){
            return resolve(db);
        });
    });
}
