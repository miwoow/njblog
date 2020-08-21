const { ObjectId } = require('mongodb');

var MongoClient = require('mongodb').MongoClient;

class CommentModel {
    constructor() {
        var that = this;
        var mongodbUri = process.env.MONGO_URI;
        MongoClient.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
            if (err) {
                return console.dir(err);
            } else {
                that.db = db.db('myblog');
            }
        });
    }

    getCollection(callback) {
        this.db.collection('comment', function(err, comment_collection) {
            if (err) {
                callback(err);
            } else {
                callback(null, comment_collection);
            }
        });
    }

    findById(id, callback) {
        this.getCollection(function(err, comment_collection) {
            if (err) {
                callback(err);
            } else {
                comment_collection.findOne({'_id': ObjectId(id)}, function(err, docs) {
                    callback(err, docs);
                });
            }
        });
    }

    findAndIncLike(id, callback) {
        this.getCollection(function(err, comment_collection) {
            if (err) {
                callback(err);
            } else {
                comment_collection.findOneAndUpdate({'_id': ObjectId(id)}, {'$inc': {'like': 1}}, function(err, docs) {
                    callback(err, docs);
                });
            }
        });
    }

    findPage(blogId, pageNum, callback) {
        this.getCollection(function(err, comment_collection) {
            if (err) {
                callback(err);
            } else {
                comment_collection.find({'blogId': blogId}).sort({'createAt': -1}).limit(5).skip(pageNum*5).toArray(function(err, docs) {
                    if(err) {
                        callback(err);
                    } else {
                        callback(null, docs);
                    }
                });

            }
        });
    }

    getCount(callback) {
        this.getCollection(function(err, comment_collection) {
            if (err) callback(err);
            else {
                comment_collection.find().count(function(err, num) {
                    callback(err, num);
                });
            }
        });
    }

    createComment(blogId, comment, callback) {
        this.getCollection(function(err, comment_collection) {
            if (err) callback(err);
            else {
                var blog = {'blogId': blogId, 'comment': comment, 'createAt': new Date()};
                comment_collection.insertOne(blog, function() {
                    callback(null, blog);
                });
            }
        });
    }
}

exports.CommentModel = CommentModel;
