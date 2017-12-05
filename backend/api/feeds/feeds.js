/**
 * Created by dvicente on 12/09/2017
 */
'use strict'

var RSSFeedGenerator = require('feed');
var utils = require('../../tools/utils');
var constants = require('../../tools/constants');
var logger = require('../../tools/logger');

var feedsDomain = require('../../domain/feeds/feeds');
var itemsDomain = require('../../domain/feeds/items');

var itemsApi = require('../../api/feeds/items');



exports.getFeedInfo = function (req, res, next) {
    var feedId = req.params.feedId;

    feedsDomain.getFeedInfo(feedId)
    .then(feedInfo => {
        return res.status(200).send(feedInfo);
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


exports.getRSSFeed = function (req, res, next) {
    var feedId = req.params.feedId;
    var rss;

    feedsDomain.getFeed(feedId)
    .then(feed => {
        if(!feed) {
            return res.status(404).send({"message": req.i18n.__("ERROR_FEED_NOT_FOUND")});
        }
        var feedOptions = feedsDomain.getFeedOptions(feed);
        rss = new RSSFeedGenerator(feedOptions);
        return itemsDomain.getItemsByFeedId(feedId, false);
    })
    .then(items => {
        var item;
        for(var index in items) {
            item = itemsApi.formatItem(items[index]);
            rss.addItem(item);
        }

        var xml = rss.render('rss-2.0');
        return res.send(xml);
    })
    .catch(error => {
        logger.error(error);
        return res.status(400).send();
    });
};


exports.imageSearch = function (req, res, next) {
    var url = req.query.url;
    if(!url) {
        return res.status(400).send({"message": req.i18n.__("ERROR_MISSING_MANDATORY_FIELDS")});
    }

    feedsDomain.searchImageByUrl(url)
    .then(image => {
        if(!image) {
            image = "";
            logger.debug("No image found for url = " + url);
        }

        return res.send({image: image});
    })
};


exports.feedSearch = function (req, res, next) {
    var name = req.query.name;

    feedsDomain.getFeedByName(name)
    .then(feed => {
        var feedInfo = {};
        if(feed) {
            feedInfo = feedsDomain.getFeedData(feed);
        }
        res.send(feedInfo);
    });
};


exports.getBulletinFeed = function (req, res, next) {
    var week = req.query.week;
    var year = req.query.year;
    if(!week  ||  !year) {
        return res.status(400).send({"message": req.i18n.__("ERROR_MISSING_MANDATORY_FIELDS")});
    }

    feedsDomain.getBulletinFeed(year, week)
    .then(html => {
        return res.send(html);
    })
    .catch(error => {
        logger.error(error);
        return res.status(400).send();
    });
};
