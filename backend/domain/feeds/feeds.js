/**
 * Created by dvicente on 12/09/2017
 */

'use strict';

var fs = require("fs");
var path = require("path");
var sprintf = require("sprintf");
var FeedMe = require('feedme');
var https = require('https');
var http = require('http');
var ImageResolver = require('image-resolver');
var numSearchResults = require("number-search-results");
var logger = require('../../tools/logger');
var utils = require('../../tools/utils');

var itemsDomain = require('./items');
var usersDomain = require('../users/users');
var feedsDB = require('../../db/feeds/feeds');



// Set info for library
var getFeedOptions = exports.getFeedOptions = function(feed) {
    var feedOptions = {};
    feedOptions.title = feed.title ? feed.title: "";
    feedOptions.description = feed.description ? feed.description: "";
    feedOptions.generator = feed.generator ? feed.generator: "";
    feedOptions.link = feed.link ? feed.link: "";
    feedOptions.image = feed.image ? feed.image: "";
    feedOptions.docs = feed.docs ? feed.docs: "";
    feedOptions.managingEditor = feed.managingEditor ? feed.managingEditor: "";
    feedOptions.webMaster = feed.webMaster ? feed.webMaster: "";
    feedOptions.copyright = feed.copyright ? feed.copyright: "";
    feedOptions.language = feed.language ? feed.language: "";
    return feedOptions;
}


// Add info for library with internal info
var getFeedData = exports.getFeedData = function(feed) {
    var feedData = getFeedOptions(feed);
    feedData.name = feed.name;
    feedData._id = feed._id;
    return feedData;
}



var createFeed = exports.createFeed = function(name, ownerId, title, description, link, image, generator, docs, managingEditor, webMaster, copyright, language) {
    return feedsDB.createFeed(name, ownerId, title, description, link, image, generator, docs, managingEditor, webMaster, copyright, language);
};


exports.deleteFeed = function(feedId) {
    return getFeed(feedId)
    .then(feed => {
        if(!feed) {
            throw "ERROR_FEED_NOT_FOUND"
        }

        return feedsDB.deleteFeed(feedId);
    });
}


var getFeed = exports.getFeed = function(feedId) {
    return feedsDB.getFeed(feedId);
};


exports.getFeedInfo = function(feedId) {
    return getFeed(feedId)
    .then(feed => {
        if(!feed) {
            throw "ERROR_FEED_NOT_FOUND"
        }

        return getFeedData(feed);
    });
};


var searchImageByUrl = exports.searchImageByUrl = function(url) {
    return new Promise((resolve, reject) => {
        var resolver = new ImageResolver();
        resolver.register(new ImageResolver.FileExtension());
        resolver.register(new ImageResolver.MimeType());
        resolver.register(new ImageResolver.Opengraph());
        resolver.register(new ImageResolver.Webpage());

        resolver.resolve(url, function(result){
            if (result) {
                return resolve(result.image);
            }
            return resolve(null);
        });
    });
};


var getFeedByName = exports.getFeedByName = function(name) {
    return feedsDB.getFeedByName(name)
    .then(feed => {
        return feed;
    });
}



exports.getBulletinFeed = function (year, week) {
    var feedName = "Bulletin";
    var feedTitle = "Bulletin";
    var feedDescription = "Weekly bulletin";
    var templateFile = path.join(__dirname, './', 'newsletterTemplate.html');
    var MAX_DESCRIPTION_SIZE = 150;
    var items;

    var originDate = utils.firstDayOfWeek(week, year);
    var endDate = new Date(new Date(originDate).setDate(originDate.getDate() + 7));

    logger.debug("Generating bulletin for week: " + week + " - " + year);
    logger.debug(originDate + " - " + endDate);

    return getFeedByName(feedName)
    .then(feed => {
        if(!feed) {
            var user = req.user;
            return createFeed(feedName, user._id, feedTitle, feedDescription);
        }
        return feed;
    })
    .then(feed => {
        // Get items of that week (between the dates)
        return itemsDomain.getItemsByFeedId(feed._id, true, originDate, endDate);
    })
    .then(itemsFeed => {
        items = itemsFeed;
        items.reverse();
        var counter = 0;
        var itemPromises = [];
        for(var item of items) {
            // make sure description is not too long
            if(item.description.length > MAX_DESCRIPTION_SIZE) {
                item.description = item.description.substring(0, MAX_DESCRIPTION_SIZE) + " ...";
            }
            itemPromises.push(generateBulletinItemHtml(item));
        }

        return Promise.all(itemPromises);
    })
    .then(htmlItems => {
        var html = fs.readFileSync(templateFile);
        html += '</div><h2>Week ' + week + ' - ' + year + '</h2><div class="table-responsive">';

        for(var htmlItem of htmlItems) {
            html += htmlItem;
        }
        html += '</div></div></body></html>';
        return html;
    });
}


var generateBulletinItemHtml = function(item) {
    var itemHtmlTemplate = `<div class="col-xs-12 col-md-6 col-lg-4">
        <h4><a href="%s">%s</a></h4>
        <p>%s</p>
        <p><a href="%s"><img src="%s" class="img-rounded img-responsive center-block" width="300"></a></p>
        %s
    </div>`;

    var twitterHtmlTemplate = '<p align="right"><a href="https://twitter.com/%s"><span class="label label-primary">@%s</span></a></p>';
    return usersDomain.getUserById(item.owner)
    .then(user => {
        var twitterUsername = user && user.twitterUsername ? user.twitterUsername : item && item.twitterUsername ? item.twitterUsername : '';
        var twitterHtml = twitterUsername !== '' ? sprintf(twitterHtmlTemplate, twitterUsername, twitterUsername) : "";
        var itemHtml = sprintf(itemHtmlTemplate, item.link, item.title, item.description, item.link, item.image, twitterHtml);
        return itemHtml;
    });
}
