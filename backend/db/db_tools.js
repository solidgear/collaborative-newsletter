/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
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
