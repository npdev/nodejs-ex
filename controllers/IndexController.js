'use strict';

let router = new (require('express').Router)();
const models = require('../models');
const passport = require('passport');
const bCrypt = require('bcrypt-nodejs');
let async = require('async');
let flash = require('express-flash');
const LocalStrategy = require('passport-local').Strategy;

router.use(passport.initialize());
router.use(passport.session());

router.use(flash());

let isValidPassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

passport.use('login', new LocalStrategy({
  passReqToCallback: true
},
        function (req, username, password, done) {
          models.User.findOne({'username': username},
                  function (err, user) {
                    if (err) {
                      return done(err);
                    }
                    if (!user) {
                      console.log('User Not Found with username ' + username);
                      return done(null, false,
                              req.flash('message', 'User Not found.'));
                    }
                    if (!isValidPassword(user, password)) {
                      console.log('Invalid Password');
                      return done(null, false,
                              req.flash('message', 'Invalid Password'));
                    }
                    return done(null, user);
                  }
          );
        }));

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  models.User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.post('/login', passport.authenticate('login', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true
}));

exports.index = (req, res, next) => {
  models.Post.find().limit(10).sort({created_date: -1})
          .exec((err, result) => {
            if (err) {
              return next(err);
            }
            res.render('index', {posts: result, user: req.user});
          });
};