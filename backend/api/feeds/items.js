/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */
'use strict';

var logger = require('../../tools/logger');
var constants = require('../../tools/constants');
var config = require('../../config.json');

var itemsDomain = require('../../domain/feeds/items');



var formatItem = exports.formatItem = function(item) {
    item.guid = getItemUrl(item.feedId, item._id);
    return item;
};

var getItemUrl = function(feedId, itemId) {
    var urlItem = config.EXTERNAL_PROTOCOL + '://' + config.EXTERNAL_HOST + ':' + config.EXTERNAL_PORT + constants.API_PATH + constants.API_VERSION + '/feeds/' + feedId + '/items/' + itemId;
    return urlItem;
};



exports.addItem = function (req, res, next) {
    var feedId = req.params.feedId;
    var itemData = req.body;
    // check mandatory params
    if(!feedId || !itemData.link || !itemData.title || !itemData.description) {
        return res.status(400).send({"message": req.i18n.__("ERROR_MISSING_MANDATORY_FIELDS")});
    }

    // extract item data from request body
    var title = itemData.title;
    var description = itemData.description;
    var link = itemData.link;
    var guid = itemData.guid;
    var date = itemData.date;
    var image = itemData.image;
    var source = itemData.source;

    var user = req.user;

    itemsDomain.createItem(title, description, link, guid, date, image, source, feedId, user._id)
    .then(itemSaved => {
        var itemLocation = constants.API_PATH + constants.API_VERSION + '/feeds/' + feedId + '/items/' + itemSaved._id;
        res.setHeader('Location', itemLocation);
        res.status(201).send();
    })
    .catch(error => {
        var status = 500;
        if(error == "ERROR_FEED_NOT_FOUND") {
            status = 404;
        }
        var message = req.i18n.__(error.toString());
        logger.error(message);
        return res.status(status).send({"message": message});
    });
};


exports.updateItem = function(req, res, next) {
    var itemId = req.params.itemId;
    var itemData = req.body;
    var title = itemData.title;
    var description = itemData.description;
    var link = itemData.link;
    var image = itemData.image;
    
    itemsDomain.updateItem(itemId, title, description, link, image)
    .then(item => {
        return res.send(item);
    })
    .catch(error => {
        var status = 500;
        if(error == "ERROR_ITEM_NOT_FOUND") {
            status = 404;
        }
        var message = req.i18n.__(error.toString());
        logger.error(message);
        return res.status(status).send({"message": message});
    });
}


exports.deleteItem = function (req, res, next) {
    var feedId = req.params.feedId;
    var itemId = req.params.itemId;

    // check mandatory params
    if(!feedId || !itemId) {
        return res.status(400).send({"message": req.i18n.__("ERROR_MISSING_MANDATORY_FIELDS")});
    }

    itemsDomain.deleteItem(itemId, feedId)
    .then(() => {
        return res.status(204).send();
    })
    .catch(error => {
        var status = 500;
        if(error == "ERROR_ITEM_NOT_FOUND") {
            status = 404;
        }
        var message = req.i18n.__(error.toString());
        logger.error(message);
        return res.status(status).send({"message": message});
    });
}


exports.getItem = function (req, res, next) {
    var itemId = req.params.itemId;
    itemsDomain.getItem(itemId)
    .then(item => {
        if(!item) {
            return res.status(404).send({"message": req.i18n.__("ERROR_ITEM_NOT_FOUND")});
        }
        item = formatItem(item);
        return res.send(item);
    })
    .catch(error => {
        logger.error(error);
        return res.status(400).send();
    });
};


exports.getItems = function (req, res, next) {
    var feedId = req.params.feedId;

    itemsDomain.getItemsByFeedId(feedId, true)
    .then(items => {
        var item;
        var itemsResponse = [];
        for(var index in items) {
            item = formatItem(items[index]);
            itemsResponse.push(item);
        }
        return res.send(itemsResponse);
    })
    .catch(error => {
        logger.error(error);
        res.status(400).send();
    });
};

