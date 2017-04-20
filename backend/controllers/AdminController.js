'use strict';

const models = require('../../models');
let async = require('async');

exports.index = function (req, res) {
  async.parallel({
    usersCount: function (callback) {
      models.User.count(callback);
    }
  }, function (err, results) {
    res.render('index_admin', {title: 'Node.js Blog', error: err, data: results});
  });
};

exports.createPostGet = function (req, res) {
  res.render('post_form', {title: 'Create post'});
};

exports.createPostPost = function (req, res, next) {
  req.checkBody('title', 'Title must not be empty.').notEmpty();
  req.checkBody('content', 'Content must not be empty').notEmpty();
  req.sanitize('title').escape();
  req.sanitize('content').escape();
  req.sanitize('title').trim();
  req.sanitize('content').trim();

  var post = new models.Post(
          {title: req.body.title,
            content: req.body.content,
          });

  console.log('post: ' + post);

  var errors = req.validationErrors();
  if (errors) {
    console.log('category: ' + req.body.category);

    console.log('ERRORS: ' + errors);

    async.parallel({
      categories: function (callback) {
        models.Category.find(callback);
      },
    }, function (err, results) {
      if (err) {
        return next(err);
      }

      for (i = 0; i < results.categories.length; i++) {
        if (post.category.indexOf(results.categories[i]._id) > -1) {
          results.categories[i].checked = 'true';
        }
      }

      res.render('post_form', {title: 'Create Post', categories: results.categories, post: post, errors: errors});
    });

  } else {
    post.save(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect(post.url);
    });
  }

};