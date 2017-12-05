/**
 * Created by dvicente on 12/09/2017
 */

var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var logger = require('../../tools/logger');


// Create a Mongoose schema
var FeedSchema = new mongoose.Schema({
    name: { type: String, required: true},
    owner: { type: mongoose.Schema.Types.ObjectId, required: true},
    title: String,
    description: String,
    link: String,
    image: String,
    generator: String,
    docs: String,
    managingEditor: String,
    webMaster: String,
    copyright: String,
    language: String
});

// Note that Mongoose middleware will be executed as usual
FeedSchema.pre('save', function (next) {
    next();
});

// Register the schema
var Feed = mongoose.model('feed', FeedSchema);
exports.Feed = Feed;

var formatFeed = function(feed) {
    return {
        _id: feed._id,
        name: feed.name,
        owner: feed.owner,
        title: feed.title,
        description: feed.description,
        link: feed.link,
        image: feed.image,
        generator: feed.generator,
        docs: feed.docs,
        managingEditor: feed.managingEditor,
        webMaster: feed.webMaster,
        copyright: feed.copyright,
        language: feed.language
    };
};

exports.createFeed = function(name, owner, title, description, link, image, generator, docs, 
                            managingEditor, webMaster, copyright, language) {
    return new Feed({name: name, owner: owner, title: title, description: description, link: link,
                    image: image, generator: generator, docs: docs, managingEditor: managingEditor,
                    webMaster: webMaster, copyright: copyright, language: language}).save()
    .then(feed => {
        return formatFeed(feed);
    });
};


exports.deleteFeed = function(feedId) {
    var query = { '_id': feedId };
    return Feed.remove(query).exec();
}


exports.getFeed = function (feedId) {
    var query = { '_id': feedId };
    return Feed.findOne(query).lean(true).exec();
};


exports.getFeedByName = function (name) {
    var query = { 'name': name };
    return Feed.findOne(query).lean(true).exec();
};
