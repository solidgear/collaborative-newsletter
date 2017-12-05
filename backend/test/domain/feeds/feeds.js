/**
 * @license
 * Solid GEAR Projects S.L.
 * http://solidgeargroup.com
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://opensource.org/licenses/MIT
 */

var assert = require('chai').assert;
var expect = require('chai').expect;

var utilsFeeds = require('./utils');
var feedsDomain = require('../../../domain/feeds/feeds');


describe('Feeds', function () {

    describe('create', function () {
        var feedId;

        after(function () {
            return feedsDomain.deleteFeed(feedId);
        })

        it('Create feed', function () {
            var feedData = utilsFeeds.createFeedData();
            return feedsDomain.createFeed(feedData.name, feedData.owner, feedData.title, feedData.description, feedData.link, feedData.image, feedData.generator, feedData.docs, feedData.managingEditor, feedData.webMaster, feedData.copyright, feedData.language)
            .then(feed => {
                feedId = feed._id;
                assert.isNotNull(feed);
            });
        })
    });


    describe('delete', function () {
        var feedId;

        before(function () {
            return utilsFeeds.createTestFeed()
            .then(feed => {
                feedId = feed._id;
            });
        })

        it('Delete feed', function () {
            return feedsDomain.deleteFeed(feedId)
            .then(() => {
                return feedsDomain.getFeed(feedId);
            })
            .then(feed => {
                assert.isNull(feed);
            });
        })
    });



    describe('get', function () {
        var NUM_FEEDS_TO_CREATE = 3;
        var feedIds = [];
        var feeds = [];

        before(function (done) {
            var numCreated = 0;
            var numFeed = NUM_FEEDS_TO_CREATE;
            while(numFeed --) {
                utilsFeeds.createTestFeed()
                .then(feed => {
                    feeds.push(feed);
                    feedIds.push(feed._id);
                    if(++numCreated >= NUM_FEEDS_TO_CREATE) {
                        done();
                    }
                });
            }
        });

        after(function (done) {
            var numRemoved = 0;
            for(var feedId of feedIds) {
                feedsDomain.deleteFeed(feedId)
                .then(feed => {
                    if(++numRemoved >= NUM_FEEDS_TO_CREATE) {
                        done();
                    }
                });
            }
        });

        it('Get feed', function () {
            return feedsDomain.getFeedInfo(feedIds[0])
            .then(feed => {
                assert.isNotNull(feed);
                assert.strictEqual(feed.name, feeds[0].name);
                assert.strictEqual(feed.title, feeds[0].title);
            })
        });

        it('Get feed by name', function () {
            return feedsDomain.getFeedByName(feeds[0].name)
            .then(feed => {
                assert.isNotNull(feed);
                assert.strictEqual(feed.name, feeds[0].name);
                assert.strictEqual(feed.title, feeds[0].title);
            })
        });
    });


})
