/**
 * Created by dvicente on 13/09/2017
 */

var feedsDomain = require('../../../domain/feeds/feeds');
var itemsDomain = require('../../../domain/feeds/items');

var userId = exports.userId = '576ba5fad51a99435276aea9';

var createFeedData = exports.createFeedData = function() {
    return {
        name: Math.random().toString(36).substring(14).toUpperCase(),
        owner: userId,
        title: Math.random().toString(36).substring(14).toUpperCase(),
        description: Math.random().toString(36).substring(14).toUpperCase(),
        link: Math.random().toString(36).substring(14).toUpperCase(),
        image: Math.random().toString(36).substring(14).toUpperCase(),
        generator: Math.random().toString(36).substring(14).toUpperCase(),
        docs: Math.random().toString(36).substring(14).toUpperCase(),
        managingEditor: Math.random().toString(36).substring(14).toUpperCase(),
        webMaster: Math.random().toString(36).substring(14).toUpperCase(),
        copyright: Math.random().toString(36).substring(14).toUpperCase(),
        language: Math.random().toString(36).substring(14).toUpperCase()
    };
};


var createTestFeed = exports.createTestFeed = function() {
    var feedData = createFeedData();
    return feedsDomain.createFeed(feedData.name, feedData.owner, feedData.title, feedData.description, feedData.link, feedData.image, feedData.generator, feedData.docs, feedData.managingEditor, feedData.webMaster, feedData.copyright, feedData.language);
};


var createItemData = exports.createItemData = function(feedId) {
    return {
        title: Math.random().toString(36).substring(14).toUpperCase(),
        description: Math.random().toString(36).substring(14).toUpperCase(),
        link: Math.random().toString(36).substring(14).toUpperCase(),
        guid: Math.random().toString(36).substring(14).toUpperCase(),
        date: new Date(),
        image: Math.random().toString(36).substring(14).toUpperCase(),
        source: Math.random().toString(36).substring(14).toUpperCase(),
        feedId: feedId,
        owner: userId
    };
};


exports.createTestItem = function() {
    return createTestFeed()
    .then(feed => {
        var itemData = createItemData(feed._id);
        return itemsDomain.createItem(itemData.title, itemData.description, itemData.link, itemData.guid, itemData.date, itemData.image, itemData.source, itemData.feedId, itemData.owner);
    });
};


exports.deleteItem = function(itemId) {
    var feedId;
    return itemsDomain.getItem(itemId)
    .then(item => {
        feedId = item.feedId;
        return feedsDomain.deleteFeed(item.feedId);
    })
    .then(() => {
        return itemsDomain.deleteItem(itemId, feedId);
    });
}