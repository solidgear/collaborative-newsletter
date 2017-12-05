/**
 * Created by dvicente on 12/09/2017
 */
'use strict';

var logger = require('../../tools/logger');
var itemsDB = require('../../db/feeds/items');
var feedsDomain = require('./feeds');

exports.createItem = function(title, description, link, guid, date, image, source, feedId, owner) {
    try {
        date = date ? new Date(date): new Date();
    } catch(error) {
        throw error;
    }
    
    return feedsDomain.getFeed(feedId)
    .then(feed => {
        //it has been checked before, so it should not throws ever
        if(!feed) {
            throw "ERROR_FEED_NOT_FOUND";
        }

        return itemsDB.createItem(title, description, link, guid, date, image, source, feedId, owner);
    });
};


exports.updateItem = function(itemId, title, description, link, image) {
    return itemsDB.getItem(itemId)
    .then(item => {
        if(!item) {
            throw "ERROR_ITEM_NOT_FOUND";
        }

        return itemsDB.updateItem(itemId, title, description, link, image);
    });
}


exports.deleteItem = function(itemId, feedId) {
    return getItem(itemId)
    .then(item => {
        if(!item ||  item.feedId.toString() != feedId.toString()) {
            throw "ERROR_ITEM_NOT_FOUND";
        }

        return itemsDB.deleteItem(itemId);
    });
}


var getItem = exports.getItem = function (itemId) {
    return itemsDB.getItem(itemId);
};


exports.getItemsByFeedId = function (feedId, includePending, originDate, endDate) {
    return itemsDB.getItemsByFeedId(feedId, includePending, originDate, endDate);
};

