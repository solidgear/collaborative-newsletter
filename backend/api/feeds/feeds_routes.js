/**
 * Created by dvicente on 12/09/2017
 */

var constants = require('../../tools/constants');
var utils = require('../../tools/utils');
var permsRoles = require('../../tools/permissions');
var feeds = require('./feeds');
var items = require('./items');

var feedsDomain = require('../../domain/feeds/feeds');
var itemsDomain = require('../../domain/feeds/items');


exports.loadRoutes = function(app) {
    // CRUD news
    app.get(constants.API_PATH + constants.API_VERSION + '/feeds/:feedId/items/:itemId', items.getItem);
    app.get(constants.API_PATH + constants.API_VERSION + '/feeds/:feedId/items', utils.defaultAuthentication(), utils.validatePermission(permsRoles.perms.READ_NEWS), items.getItems);
    app.post(constants.API_PATH + constants.API_VERSION + '/feeds/:feedId/items', utils.defaultAuthentication(), utils.validatePermission(permsRoles.perms.WRITE_NEWS), items.addItem);
    app.put(constants.API_PATH + constants.API_VERSION + '/feeds/:feedId/items/:itemId', utils.defaultAuthentication(), utils.validatePermission(permsRoles.perms.WRITE_NEWS), checkItemPermissions(), items.updateItem);
    app.delete(constants.API_PATH + constants.API_VERSION + '/feeds/:feedId/items/:itemId', utils.defaultAuthentication(), utils.validatePermission(permsRoles.perms.WRITE_NEWS), checkItemPermissions(), items.deleteItem);

    // XML
    app.get(constants.API_PATH + constants.API_VERSION + '/feeds/:feedId/rss', feeds.getRSSFeed);
    app.get(constants.API_PATH + constants.API_VERSION + '/feeds/bulletin', utils.defaultAuthentication(), feeds.getBulletinFeed);

    // Feeds
    app.get(constants.API_PATH + constants.API_VERSION + '/feeds/image', feeds.imageSearch);
    app.get(constants.API_PATH + constants.API_VERSION + '/feeds/feed_search', feeds.feedSearch);
    app.get(constants.API_PATH + constants.API_VERSION + '/feeds/:feedId', feeds.getFeedInfo);
};


// resources with this validation can only be use it by the owner of the feed
var checkFeedPermissions = function() {
    return function (req, res, next) {
        var user = req.user;
        var feedId = req.params.feedId;

        feedsDomain.getFeed(feedId)
            .then(feed => {
                if((!feed) || (feed.owner.toString() != user._id.toString())) {
                    return res.status(403).send();
                }

                return next();
            })
    }
}

// resources with this validation can only be use it by the owner of the item
var checkItemPermissions = function() {
    return function (req, res, next) {
        var user = req.user;
        var itemId = req.params.itemId;
        var feedId = req.params.feedId;

        itemsDomain.getItem(itemId)
            .then(item => {
                if(feedId !== item.feedId.toString()) {
                    return res.status(404).send();
                }
                if((!item) || (item.owner.toString() != user._id.toString())) {
                    return res.status(403).send();
                }

                return next();
            })
    }
}

