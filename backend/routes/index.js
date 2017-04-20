'use strict';

let express = require('express');
let router = express.Router();
const controllers = require("../controllers");
const middleware = require("../../middleware");
router.get('/*', middleware.isLoggedIn, controllers.AdminController.index);
//router.get('/*', (req, res, next) => {
//  if (!req.user || req.user === undefined) {
//    res.redirect('/login');
//  }
//  next();
//});
//router.get('/', controllers.AdminController.index);
router.get('/post/create', controllers.AdminController.createPostGet);
router.post('/post/create', controllers.AdminController.createPostPost);
module.exports = router;
