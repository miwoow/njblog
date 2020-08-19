const { ObjectId } = require('mongodb');

var MongoClient = require('mongodb').MongoClient;

class AuthServiceUserModel {
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
        this.db.collection('users', function(err, collection) {
            if (err) {
                callback(err);
            } else {
                callback(null, collection);
            }
        });
    }

    createUserWithEmailAndPassword(email, password, callback) {
        this.getCollection(function(err, collection) {
            if (err) callback(err);
            else {
                var user = {'email': email, 'password': password, 'createAt': new Date(), 'lastLogin': new Date(), 'fromAt': '', 'actived': false};
                collection.insertOne(user, function(){
                    callback(null, user);
                });
            }
        });
    }

    findOneByEmailAndPassword(email, password, callback) {
        this.getCollection(function(err, collection) {
            if (err) callback(err);
            else {
                collection.findOne({'email': email, 'password': password}, function(err, docs){
                    callback(err, docs);
                });
            }
        });
    }
}

exports.AuthServiceUserModel = AuthServiceUserModel;