const { ObjectId } = require('mongodb');
const crypto = require('crypto');

var MongoClient = require('mongodb').MongoClient;

var ActionCodeType = {
    ACTIVE_ACCOUNT: 1
};

class ActionCodeModel {
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
        this.db.collection('action_code', function(err, collection) {
            if (err) {
                callback(err);
            } else {
                callback(null, collection);
            }
        });
    }

    findOneByCode(code, callback) {
        this.getCollection(function(err, collection) {
            if (err) callback(err);
            else {
                collection.findOne({'code': code}, function(err, doc) {
                    callback(err, doc);
                });
            }
        });
    }

    genActionCode(codeType, codeInfo, callback) {
        var len= 32;
        var code = crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
        this.getCollection(function(err, collection) {
            if (err) callback(err);
            else {
                var actionCode = {'code': code, 'codeType': codeType, 'codeInfo': codeInfo, 'createAt': new Date(), 'usedAt': null};
                collection.insertOne(actionCode, function() {
                    callback(null, actionCode);
                });
            }
        });
    }

    createActionCode(code, codeType, codeInfo, callback) {
        this.getCollection(function(err, collection) {
            if (err) callback(err);
            else {
                var actionCode = {'code': code, 'codeType': codeType, 'codeInfo': codeInfo, 'createAt': new Date(), 'usedAt': null};
                collection.insertOne(actionCode, function() {
                    callback(null, actionCode);
                });
            }
        });
    }
}

exports.ActionCodeModel = ActionCodeModel;
exports.ActionCodeType = ActionCodeType;