/**
 * Created by dvicente on 12/09/2017
 */

var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var logger = require('../../tools/logger');
var utils = require('../../tools/utils');


// Create a Mongoose schema
var ItemSchema = new mongoose.Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    link: { type: String, required: true},
    guid: { type: String, required: false},
    date: { type: Date, required: false, default: utils.getCurrentDateFormatted },
    image: { type: String, required: false},
    source: { type: String, required: false},
    feedId: { type: mongoose.Schema.Types.ObjectId, required: true},
    owner: { type: mongoose.Schema.Types.ObjectId, required: true}
});

// Note that Mongoose middleware will be executed as usual
ItemSchema.pre('save', function (next) {
    next();
});

// Register the schema
var Item = exports.Item = mongoose.model('item', ItemSchema);

var formatItem = function(item) {
    return {
        _id: item._id,
        title: item.title,
        description: item.description,
        link: item.link,
        guid: item.guid,
        date: item.date,
        image: item.image,
        source: item.source,
        feedId: item.feedId,
        owner: item.owner
    };
};

exports.createItem = function(title, description, link, guid, date, image, source, feedId, owner) {
    var item = new Item({title: title, description: description, link: link, guid: guid, date: date, image: image, source: source, feedId: ObjectID(feedId), owner: new ObjectID(owner.toString())});
    return item.save()
    .then(itemCreated => {
        return formatItem(itemCreated);
    });
};

exports.updateItem = function(itemId, title, description, link, image) {
    var data = {};
    if(title) {
        data.title = title;
    }
    if(description) {
        data.description = description;
    }
    if(link) {
        data.link = link;
    }
    if(image) {
        data.image = image;
    }
    return Item.findOneAndUpdate({_id: itemId}, data, {new: true}).lean(true).exec();
}

exports.getItem = function (itemId) {
    var query = { '_id': itemId };
    return this.Item.findOne(query).lean(true).exec();
};


exports.getItemsByFeedId = function (feedId, includePending, originDate, endDate) {
    var now = new Date();
    var query = { 'feedId': ObjectID(feedId) };

    if (!includePending) {
        queryIncludePending = {"$lte": now};
    }

    if(originDate && endDate) {
        if (!includePending) {
            query.date = {"$gte": originDate, "$lt": endDate, "$lte": now};
        } else {
            query.date = {"$gte": originDate, "$lt": endDate};
        }
    } else if (!includePending) {
        query.date = {"$lte": now};
    }

    return this.Item.find(query).sort({'date': -1}).lean(true).exec();
};


exports.deleteItem = function(itemId) {
    var query = { '_id': itemId };
    return Item.remove(query).exec();
}