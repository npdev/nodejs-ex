'use strict';
let router = new (require('express').Router)();
const models = require('../models');

router.get('/', (req, res, next) => {
  models.Post.find({}).exec().then((posts) => {
    res.render('index', {
      title: 'Node.js Blog',
      posts: posts
    });
  }).catch(next);
});

module.exports = router;
