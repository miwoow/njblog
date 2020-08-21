var express = require('express');
const { AuthServiceUserModel } = require('../models/AuthServiceUserModel');
const { ActionCodeModel, ActionCodeType } = require('../models/ActionCodeModel');
const { AuthServiceSessionModel } = require('../models/AuthServiceSessionModel');
const { MailUtil } = require('../utils/MailUtil');

var router = express.Router();

var authServiceUserModel = new AuthServiceUserModel();
var actionCodeModel = new ActionCodeModel();
var authServiceSessionModel = new AuthServiceSessionModel();

router.post('/createUserWithEmailAndPassword', function(req, res, next) {
    var email = req.body['email'];
    var password = req.body['password'];

    authServiceUserModel.createUserWithEmailAndPassword(email, password, function(err, docUser) {
        if (err) {
            res.json({'code': 1, 'msg': err});
        } else {
            // 发送激活邮件。
            actionCodeModel.genActionCode(ActionCodeType.ACTIVE_ACCOUNT, docUser.email, function(err, doc) {
                var mailUtil = new MailUtil();
                var activeUrl = process.env.MY_HOST+'authService/applyActionCode/'+doc.code;
                console.log(activeUrl);
                mailUtil.sendMail(email, '帐号激活', '点击链接，激活帐号：<a href="'+activeUrl+'">激活帐号</a>');
                res.json({'code': 0, 'msg': docUser});
            });
        }
    });
});

router.post('/sendEmailVerification', function(req, res, next) {
    var email = req.body['email'];
     // 发送激活邮件。
     actionCodeModel.genActionCode(ActionCodeType.ACTIVE_ACCOUNT, email, function(err, doc) {
        var mailUtil = new MailUtil();
        var activeUrl = process.env.MY_HOST+'authService/applyActionCode/'+doc.code;
        console.log(activeUrl);
        mailUtil.sendMail(email, '帐号激活', '点击链接，激活帐号：<a href="'+activeUrl+'">激活帐号</a>');
        res.json({'code': 0, 'msg': 'ok'});
    });
});

router.post('/signInWithEmailAndPassword', function(req, res, next) {
    var email = req.body['email'];
    var password = req.body['password'];

    authServiceUserModel.findOneByEmailAndPassword(email, password, function(err, doc) {
        if (err) {
            res.json({'code': 1, 'msg': err});
        } else {
            // 登录成功，设置cookie
            authServiceSessionModel.createSession('', function(err, doc) {
                var cookieId = doc.sessionId;
                res.cookie('FTCOOKIEID', cookieId);
                res.json({'code': 0, 'msg': {'FTCOOKIEID': cookieId}});
            });            
        }
    });
});

router.get('/applyActionCode/:code', function(req, res, next) {
    var code = req.params.code;

    // TODO: 查找到对应code，并且根据code的类型执行对应的操作。
    // 比如：用户激活类的code，就执行用户激活的行为，如果是匿名注册类的，就执行匿名注册行为。
    actionCodeModel.findOneByCode(code, function(err, docCode) {
        if (docCode.codeType === ActionCodeType.ACTIVE_ACCOUNT) {
            var expireSecs = parseInt(new Date() - docCode.createAt)/1000;
            if (expireSecs > 600) {
                res.json({'code': 1, 'msg': 'Action code is expired'});
            } else {
                // 激活用户
                authServiceUserModel.activeUser(docCode.codeInfo, function(err, doc) {
                    if (err) {
                        res.json({'code': 1, 'msg': err});
                    } else {
                        res.json({'code': 0, 'msg': doc});
                    }
                });
            }
        }
    });

});

module.exports = router;