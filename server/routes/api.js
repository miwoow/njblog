var express = require('express');
const BlogModel = require('../models/BlogModel').BlogModel;
const { json } = require('express');
var path = require('path');
const formidable = require('formidable');

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

router.get('/getblogs/:pageNum', function(req, res, next) {
  console.log(req.query);

  var pageNum = parseInt(pageNum);
  
  blogModel.getCount(function(count_err, count_num) {
    blogModel.findPage(pageNum, function(err, docs) {
        res.json({'code': 0, 'msg': {'allnum': count_num, 'docs': docs}});
    });
  });
})

router.post('/uploadimg', function(req, res, next) {
    var form = formidable({ multiples: true });
    form.encoding = 'utf-8';
    form.uploadDir = './public/images/';
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        if (err) {
          return console.log(err);
        }
        var extName = '';
        switch (files.img.type) {
        case 'image/pjpeg':
          extName = 'jpg';
          break;
        case 'image/jpeg':
          extName = 'jpg';
          break;
        case 'image/png':
          extName = 'png';
          break;
        case 'image/x-png':
          extName = 'png';
          break;
        }
        if (extName.length == 0) {
         // return console.log("no img");
        }
        // files.path = files.path.substring(7);
        files.img.path = files.img.path.substring(7);
        res.send({'code': 0, 'msg': files});
      });
    
      form.on('fileBegin', function (name, value) {
        console.log('....');
        console.log(name);
        console.log('....');
        console.log(value);
      });
    
      form.on('end', function () {
        console.log("en");
      });
    
      form.on('error', function (err) {
        console.log(err);
        console.log("error");
      });
    
      form.on('file', function (name, file) {
        console.log("```````");
        console.log(name);
        console.log(file);
      });
    
      form.on('progress', function (bytesReceived, bytesExpected) {
        var percent = Math.floor(bytesReceived / bytesExpected * 100);
        console.log(percent);
      });
});

module.exports = router;
