'use strict';

let express = require('express');
let router = express.Router();
const controllers = require("../controllers");

router.get('/', controllers.AdminController.index);
module.exports = router;
