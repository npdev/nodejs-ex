'use strict';

const express = require('express');
const router = express.Router();
const controllers = require("../controllers");
const middleware = require("../middleware");
const passport = require('passport');

router.get('/', controllers.IndexController.index);
router.get('/login', controllers.AuthController.loginGet);
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), controllers.AuthController.loginPost);
router.get('/register', controllers.AuthController.registerGet);
router.post('/register', controllers.AuthController.registerPost);

module.exports = router;
