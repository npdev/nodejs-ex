'use strict';
let router = new (require('express').Router)();
const models = require("../models");
//const URLSlugs = require('mongoose-url-slugs');
router.get('/post', function (req, res, next){
  res.render('addpost', {});
});

router.post('/post', function (req, res, next)
{
  let post = new models.Post(req.body);
  console.log(req.body);
  post.save()
          .then(() => {
            res.redirect('/');//'/post/' + post._id);
          }).catch(next);
});
//
//router.get('/post/:id', (req, res, next) => {
//  models.Post.findOne({
//    _id: req.params.id
//  }).exec().then((post) => {
//    if (!post)
//      res.redirect('/#notfound');
//    res.render('post', {
//      post
//    });
//  }).catch(next);
//});
//
//router.get('/post/:slug', (req, res, next) => {
//  models.Post.findOne({
//    slug: req.params.slug
//  }).exec().then((post) => {
//    if (!post)
//      res.redirect('/#notfound');
//    res.render('post', {
//      user: req.user,
//      post
//    });
//  }).catch(next);
//});


module.exports = router;
