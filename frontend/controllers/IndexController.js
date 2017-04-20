'use strict';

const models = require('../../models');
const passport = require('passport');
let async = require('async');

exports.index = function (req, res) {
  models.Post.find().limit(10).sort({created_date: -1})
          .exec((err, result) => {
            if (err)
              return handleError(err);
            res.render('index', {title: 'Node.js Blog', posts: result});
          });
};

exports.loginGet = function (req, res, next) {
  if (req.user)
    return res.redirect('/');
  res.render('login', {
    user: req.user,
    error: req.flash('error')
  });
};

exports.loginPost = passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true
});