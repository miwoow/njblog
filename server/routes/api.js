var express = require('express');
const BlogModel = require('../models/BlogModel').BlogModel;
const { json } = require('express');
var router = express.Router();

var blogModel = new BlogModel();

/* GET home page. */
router.post('/saveblog', function(req, res, next) {
  blogModel.createBlog(req.body['title'], req.body['body'], function(err, doc) {
    if (err) {
        res.json({'code': 1, 'msg': err});
    } else {
        res.json({'code': 0, 'msg': 'ok'});
    }
  });
});

router.get('/getblogs', function(req, res, next) {
  console.log(req.query);
  
  blogModel.findPage(0, function(err, docs) {
    res.json({'code': 0, 'msg': docs});
  });
})

module.exports = router;
