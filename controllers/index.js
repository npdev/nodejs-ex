'use strict';
let router = new (require('express').Router)();

router.use(require('./home'));
router.use(require('./post'));

module.exports = router;
