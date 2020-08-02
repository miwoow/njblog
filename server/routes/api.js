var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/saveblog', function(req, res, next) {
  console.log(JSON.stringify(req.body));
  res.json({'code': 0, 'msg': 'ok'});
});

router.get('/getblogs', function(req, res, next) {
  console.log(req.query);
  res.json({'code':0, 'msg': [{'id': 1, 'title': 'hello', 'body': 'hello world.'},
{'id': 2, 'title': 'xudong', 'body': 'xudong hello.'}]})
})

module.exports = router;
