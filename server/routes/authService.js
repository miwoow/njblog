var express = require('express');
const { AuthServiceUserModel } = require('../models/AuthServiceUserModel');

var router = express.Router();

var authServiceUserModel = new AuthServiceUserModel();

router.post('/createUserWithEmailAndPassword', function(req, res, next) {
    var email = req.body['email'];
    var password = req.body['password'];

    authServiceUserModel.createUserWithEmailAndPassword(email, password, function(err, doc) {
        if (err) {
            res.json({'code': 1, 'msg': err});
        } else {
            res.json({'code': 0, 'msg': doc});
        }
    });
});

router.post('/signInWithEmailAndPassword', function(req, res, next) {
    var email = req.body['email'];
    var password = req.body['password'];

    authServiceUserModel.findOneByUserAndPassword(email, password, function(err, doc) {
        if (err) {
            res.json({'code': 1, 'msg': err});
        } else {
            res.json({'code': 0, 'msg': doc});
        }
    });
});

module.exports = router;