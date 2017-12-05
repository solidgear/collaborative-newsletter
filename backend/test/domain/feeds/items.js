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
var itemsDomain = require('../../../domain/feeds/items');


describe('Items', function () {

    describe('create', function () {
        var itemId, feedId;

        after(function () {
            return utilsFeeds.deleteItem(itemId, feedId);
        });

        it('Create item', function () {
            return utilsFeeds.createTestFeed()
            .then(feed => {
                var itemData = utilsFeeds.createItemData(feed._id);
                return itemsDomain.createItem(itemData.title, itemData.description, itemData.link, itemData.guid, itemData.date, itemData.image, itemData.source, itemData.feedId, itemData.owner);
            })
            .then(item => {
                itemId = item._id;
                feedId = item.feedId;
                assert.isNotNull(item);
            });
        });
    });


    describe('delete', function () {
        var itemId, feedId;

        before(function () {
            return utilsFeeds.createTestItem()
            .then(item => {
                itemId = item._id;
                feedId = item.feedId;
            });
        });

        it('Delete item', function () {
            return itemsDomain.deleteItem(itemId, feedId)
            .then(() => {
                return itemsDomain.getItem(itemId);
            })
            .then(item => {
                assert.isNull(item);
            });
        });
    });


    describe('update', function () {
        var itemId, feedId;

        before(function () {
            return utilsFeeds.createTestItem()
            .then(item => {
                itemId = item._id;
                feedId = item.feedId;
            });
        });

        after(function () {
            return utilsFeeds.deleteItem(itemId, feedId);
        });

        it('Update item', function () {
            var itemData = utilsFeeds.createItemData();
            return itemsDomain.updateItem(itemId, itemData.title, itemData.description, itemData.link, itemData.image)
            .then(() => {
                return itemsDomain.getItem(itemId);
            })
            .then(item => {
                assert.isNotNull(item);
                assert.strictEqual(item.title, itemData.title);
                assert.strictEqual(item.description, itemData.description);
                assert.strictEqual(item.link, itemData.link);
                assert.strictEqual(item.image, itemData.image);
            });
        });
    });



    describe('get', function () {
        var NUM_ITEMS_TO_CREATE = 3;
        var itemIds = [];
        var items = [];

        before(function (done) {
            var numCreated = 0;
            var numItems = NUM_ITEMS_TO_CREATE;
            while(numItems --) {
                utilsFeeds.createTestItem()
                .then(item => {
                    items.push(item);
                    itemIds.push(item._id);
                    if(++numCreated >= NUM_ITEMS_TO_CREATE) {
                        done();
                    }
                });
            }
        });

        after(function (done) {
            var numRemoved = 0;
            for(var item of items) {
                utilsFeeds.deleteItem(item._id, item.feedId)
                .then(feed => {
                    if(++numRemoved >= NUM_ITEMS_TO_CREATE) {
                        done();
                    }
                });
            }
        });

        it('Get item', function () {
            return itemsDomain.getItem(itemIds[0])
            .then(item => {
                assert.isNotNull(item);
                assert.strictEqual(item.title, items[0].title);
                assert.strictEqual(item.description, items[0].description);
                assert.strictEqual(item.link, items[0].link);
                assert.strictEqual(item.guid, items[0].guid);
            });
        });

        it('Get items by feed', function () {
            return itemsDomain.getItemsByFeedId(items[0].feedId)
            .then(items => {
                expect(items.length).to.be.at.least(1);
            });
        });

    });


});

