const { v4: uuidv4 } = require('uuid');
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
        this.db.collection('session', function(err, collection) {
            if (err) {
                callback(err);
            } else {
                callback(null, collection);
            }
        });
    }

    // 暂时使用登录时间，过7天超时。
    isLogin(sessionId, callback) {
        this.getCollection(function(err, collection) {
            if (err) callback(err);
            else {
                collection.findOne({'sessionId': sessionId}, function(err, doc) {
                    var idleSecs = parseInt(new Date() - doc['lastActionTime']) / 1000;
                    // 有效期7天
                    if (idleSecs > 604800) {
                        doc.expired = true;
                    } else {
                        doc.expired = false;
                    }
                    callback(err, doc);
                });
            }
        });
    }

    createSession(sessionData, callback) {
        var sessionId = uuidv4();
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