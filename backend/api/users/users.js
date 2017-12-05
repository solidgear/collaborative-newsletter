/**
 * Created by dvicente@solidgear.es on 01/12/2017
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