var express = require('express');
const { AuthServiceUserModel } = require('../models/AuthServiceUserModel');
const { ActionCodeModel, ActionCodeType } = require('../models/ActionCodeModel');
const { MailUtil } = require('../utils/MailUtil');

var router = express.Router();

var authServiceUserModel = new AuthServiceUserModel();
var actionCodeModel = new ActionCodeModel();

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
                var activeUrl = process.env.MY_HOST+'/applyActionCode/'+doc.code;
                console.log(activeUrl);
                mailUtil.sendMail(email, '帐号激活', '点击链接，激活帐号：<a href="'+activeUrl+'">激活帐号</a>');
                res.json({'code': 0, 'msg': docUser});
            });
        }
    });
});

router.post('/signInWithEmailAndPassword', function(req, res, next) {
    var email = req.body['email'];
    var password = req.body['password'];

    authServiceUserModel.findOneByEmailAndPassword(email, password, function(err, doc) {
        if (err) {
            res.json({'code': 1, 'msg': err});
        } else {
            res.json({'code': 0, 'msg': doc});
        }
    });
});

router.get('/applyActionCode/:code', function(req, res, next) {
    var code = req.params.code;

    // TODO: 查找到对应code，并且根据code的类型执行对应的操作。
    // 比如：用户激活类的code，就执行用户激活的行为，如果是匿名注册类的，就执行匿名注册行为。
    

});

module.exports = router;