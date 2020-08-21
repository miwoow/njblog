const { ObjectId } = require('mongodb');

var MongoClient = require('mongodb').MongoClient;

class AuthServiceSessionModel {
    constructor() {
        var that = this;
        var mongodbUri = process.env.MONGO_URI;
        MongoClient.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
            if (err) {
                return console.dir(err);
            } else {
                that.db = db.db('auth_service');
            }
        });
    }

    getCollection(callback) {
        this.db.collection('blog', function(err, collection) {
            if (err) {
                callback(err);
            } else {
                callback(null, collection);
            }
        });
    }

    createSession(sessionId, sessionData, callback) {
        this.getCollection(function(err, collection) {
            if (err) callback(err);
            else {
                var sess = {'sessionId': sessionId, 'sessionData': sessionData, 'createdAt': new Date(), 'lastActionTime': new Date()};
                collection.insertOne(sess, function() {
                    callback(null, sess);
                });
            }
        });
    }
}

exports.AuthServiceSessionModel = AuthServiceSessionModel;