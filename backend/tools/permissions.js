/**
 * Created by siroramirez on 09/02/16.
 */

'use strict';

var perms = {
    PERM_ADMIN: 'PERM_ADMIN',
    PERM_USER: 'PERM_USER',

    //FEED permissions
    READ_FEED: 'READ_FEED',
    WRITE_FEED: 'WRITE_FEED',
    READ_NEWS: 'READ_NEWS',
    WRITE_NEWS: 'WRITE_NEWS',
    DELETE_NEWS: 'DELETE_NEWS'
};
exports.perms = perms;

var roles = {
  ADMIN: 'ADMIN',
  USER: 'USER'
};
exports.roles = roles;

exports.getPermissionsOfRole = function (role) {
    var permissionsPerRole = {};

    // Admin
    permissionsPerRole[roles.ADMIN] = [
        perms.PERM_ADMIN,

        // FEED permissions
        perms.READ_FEED,
        perms.WRITE_FEED,
        perms.READ_NEWS,
        perms.WRITE_NEWS,
        perms.DELETE_NEWS
    ];

    // User
    permissionsPerRole[roles.USER] = [
        perms.PERM_USER,

        // FEED permissions
        perms.READ_FEED,
        perms.READ_NEWS,
        perms.WRITE_NEWS,
        perms.DELETE_NEWS
    ];

    return permissionsPerRole[role];
};
