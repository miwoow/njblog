var express = require('express');
const BlogModel = require('../models/BlogModel').BlogModel;
const { json } = require('express');
var path = require('path');
const formidable = require('formidable');
const { route } = require('.');
const md5 = require('md5-node');
const { CommentModel } = require('../models/CommentModel');
const { AuthServiceSessionModel } = require('../models/AuthServiceSessionModel');
const { parse } = require('path');
const { Feed } = require('feed');

var router = express.Router();

var blogModel = new BlogModel();
var commentModel = new CommentModel();
var authServiceSessionModel = new AuthServiceSessionModel();

var gToken = '';

/* GET home page. */
router.post('/saveblog', function(req, res, next) {
    authServiceSessionModel.isLogin(req.cookies['FTCOOKIEID'], function(err, doc) {
        console.log(doc);
        if (doc.expired) {
            res.json({'code': 1, 'msg': 'session expired'});
        } else {
            blogModel.createBlog(req.body['title'], req.body['body'], function(err, doc) {
                if (err) {
                    res.json({'code': 1, 'msg': err});
                } else {
                    res.json({'code': 0, 'msg': 'ok'});
                }
            });
        }
    });
});

router.get('/rss', function(req, res, next) {
    var feed = new Feed({
        title: '闲情逸志的博客',
        description: 'Blog Feed',
        link: 'http://blog.haoshui.co',
        copyright: 'Copyright 2020 Xu Dong. All rights reserved.',
        author: {
            name: 'Xu Dong',
            email: 'xdsecret1@gmail.com',
            link: 'https://www.haoshui.co'
        }
    });
    blogModel.findLatestForSeed(5, function(err, docs) {
        if(err) res.send('404 Not Found', 404);
        else {
            for(var index in docs) {
                feed.addItem({
                    title: docs[index].title,
                    link: process.env.MY_HOST+'blog/'+docs[index]._id,
                    description: docs[index].body,
                    date: docs[index].createAt
                });
            }
            res.set('Content-Type', 'text/xml');
            res.send(feed.rss2());
        }
    });
});

router.post('/sendcomment', function(req, res, next) {
    blogId = req.body['id'];
    comment = req.body['comment'];

    blogModel.findById(blogId, function(err, blog) {
        if (err) {
            res.json({'code': 1, 'msg': 'blog is not exist'});
        } else {
            commentModel.createComment(blogId, comment, function(err1, comment) {
                if(err1) {
                    res.json({'code': 1, 'msg': err1});
                } else {
                    res.json({'code': 0, 'msg': comment});
                }
            });
        }
    });
});

router.get('/getcomment/:bid/:page', function(req, res, next) {
    var blogId = req.params.bid;
    var page = parseInt(req.params.page);

    commentModel.findPage(blogId, page, function(err, docs) {
        if(err) {
            res.json({'code': 1, 'msg': err});
        } else {
            res.json({'code': 0, 'msg': docs});
        }
    });
});

router.get('/getblog/:bid', function(req, res, next) {
    console.log(req.params.bid);
    var blogid = req.params.bid;
    if (blogid.length > 5) {
        blogModel.findById(blogid, function(err, doc) {
            res.json({'code': 0, 'msg': {'blog': doc}});
        });
    }
});

router.post('/like', function(req, res, next) {
    console.log(req.body['id']);
    var id = req.body['id'];
    if (id.length > 5) {
        blogModel.findAndIncLike(req.body['id'], function(err, doc) {
            res.json({'code': 0, 'msg': doc});
        });
    } else {
        res.json({'code': 1, 'msg': 'id is short:' + id});
    }  
});

router.post('/login', function(req, res, next) {
    if (req.body['email']===process.env.ADMIN_USER && req.body['password'] ===process.env.ADMIN_PASS) {
        gToken = md5(new Date() + req.body['email'] + req.body['password']);
        res.cookie('token', gToken);
        res.json({'code': 0, 'msg': {'token': gToken}});
    } else {
        res.json({'code': 1, 'msg': 'u or p error'});
    }
});

router.get('/getblogs/:pageNum', function(req, res, next) {
  var pageNum = parseInt(req.params.pageNum);
  
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
