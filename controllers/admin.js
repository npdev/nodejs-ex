'use strict';

let router = new (require('express').Router)();
const models = require('../models');
//const userAdmin = {
//  username: 'admin',
//  password: '0000',
//  role: 'admin'
//};
//
//let checkAdmin = () => {
//  models.User.findOne({'username': 'admin'}, function (err, user) {
//    if (err) {
//      console.log('Error in SignUp: ' + err);
//      return done(err);
//    }
//    if (user) {
//      return done(null);
//    } else {
//      let newUser = new models.User();
//      // установка локальных прав доступа пользователя
//      newUser.username = userAdmin.username;
//      newUser.password = createHash(userAdmin.password);
//      newUser.role = userAdmin.role;
//      newUser.save(function (err) {
//        if (err) {
//          console.log('Error in Saving user: ' + err);
//          throw err;
//          //return next(err);
//        }
//        console.log('User Registration succesful');
//        return done(null, newUser);
//      });
//    }
//  });
//};

router.get('/admin', (req, res, next) => {
//  process.nextTick(checkAdmin);
  if (!req.user || req.user === undefined) {
    res.redirect('/login');
  } 
//  else {
//    process.nextTick(
//            models.User.findOne({'username': req.user.username}, (user) => {
//              if (user.role !== 'admin') {
//                res.redirect('/login');
//              }
//              res.render('admin', {user: req.user});
//            }));
//  }
});

module.exports = router;
