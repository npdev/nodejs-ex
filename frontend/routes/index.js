'use strict';

let express = require('express');
let router = express.Router();
const frontControllers = require("../controllers");
const commonControllers = require("../../controllers");

router.get('/', frontControllers.IndexController.index);
router.get('/login', frontControllers.IndexController.loginGet);
router.use(require("../../controllers/IndexController"));
module.exports = router;