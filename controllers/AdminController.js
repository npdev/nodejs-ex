'use strict';

const models = require('../models');
let async = require('async');

exports.index = function (req, res) {
  async.parallel({
    usersCount: function (callback) {
      models.User.count(callback);
    }
  }, function (err, results) {
    res.render('index', {title: 'Node.js Blog', error: err, data: results});
  });
};