const { ObjectId } = require('mongodb');

var MongoClient = require('mongodb').MongoClient;

class BlogModel {
    constructor() {
        var that = this;
        var mongodbUri = 'mongodb://localhost/myblog';
        MongoClient.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
            if (err) {
                return console.dir(err);
            } else {
                that.db = db.db('myblog');
            }
        });
    }

    getCollection(callback) {
        this.db.collection('blog', function(err, blog_collection) {
            if (err) {
                callback(err);
            } else {
                callback(null, blog_collection);
            }
        });
    }

    findAndIncLike(id, callback) {
        this.getCollection(function(err, blog_collection) {
            if (err) {
                callback(err);
            } else {
                blog_collection.findOneAndUpdate({'_id': ObjectId(id)}, {'$inc': {'like': 1}}, function(err, docs) {
                    callback(err, docs);
                });
            }
        });
    }

    findPage(pageNum, callback) {
        this.getCollection(function(err, blog_collection) {
            if (err) {
                callback(err);
            } else {
                blog_collection.find().sort({'createAt': -1}).limit(5).skip(pageNum*5).toArray(function(err, docs) {
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
        this.getCollection(function(err, blog_collection) {
            if (err) callback(err);
            else {
                blog_collection.find().count(function(err, num) {
                    callback(err, num);
                });
            }
        });
    }

    createBlog(title, body, callback) {
        this.getCollection(function(err, blog_collection) {
            if (err) callback(err);
            else {
                var blog = {'title': title, 'body': body, 'createAt': new Date(), 'author': 'xd', 'like': 0};
                blog_collection.insertOne(blog, function() {
                    callback(null, blog);
                });
            }
        });
    }
}

exports.BlogModel = BlogModel;
