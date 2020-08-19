const { ObjectId } = require('mongodb');

var MongoClient = require('mongodb').MongoClient;

class ActionCodeModel {
    constructor() {
        var that = this;
        var mongodbUri = 'mongodb://localhost/myblog';
        MongoClient.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
            if (err) {
                return console.dir(err);
            } else {
                that.db = db.db('auth_service');
            }
        });
    }

    getCollection(callback) {
        this.db.collection('action_code', function(err, collection) {
            if (err) {
                callback(err);
            } else {
                callback(null, collection);
            }
        });
    }
}

exports.ActionCodeModel = ActionCodeModel;