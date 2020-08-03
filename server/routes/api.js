var express = require('express');
const { default: BlogModel } = require('../models/BlogModel');
const { json } = require('express');
var router = express.Router();

/* GET home page. */
router.post('/saveblog', function(req, res, next) {
  console.log(JSON.stringify(req.body));
  jsonBody = JSON.stringify(req.body);
  BlogModel.createBlog(jsonBody['title'], jsonBody['body'], function(err, doc) {
    res.json({'code': 0, 'msg': 'ok'});
  });
});

router.get('/getblogs', function(req, res, next) {
  console.log(req.query);
  
  BlogModel.findPage(0, function(err, docs) {
    res.json({'code': 0, 'msg': docs});
  });
//   res.json({'code':0, 'msg': [{'id': 1, 'title': 'hello', 'body': 'hello world.'},
// {'id': 2, 'title': 'xudong', 'body': 'xudong hello.'}]})
})

module.exports = router;
