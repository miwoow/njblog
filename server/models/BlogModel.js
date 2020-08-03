var MongoClient = require('mongodb').MongoClient;

class BlogModel {
    constructor() {
        mongodbUri = 'mongodb://localhost/myblog';
        MongoClient.connect(mongodbUri, function(err, db) {
            if (err) {
                return console.dir(err);
            } else {
                this.db = db;
            }
        });
    }

    getCollection(callback) {
        this.db.collection('blog', function(err, blog_collection) {
            if (err) {
                callback(err);
            } else {
                callback(blog_collection);
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
                        callback(docs);
                    }
                });

            }
        });
    }

    createBlog(title, body, callback) {
        this.getCollection(function(err, blog_collection) {
            if (err) callback(err);
            else {
                blog = {'title': title, 'body': body, 'createAt': new Date()};
                blog_collection.insert(blog, function() {
                    callback(null, blog);
                });
            }
        });
    }
}

module.exports = BlogModel;