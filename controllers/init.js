'use strict';

const models = require('../models');
const bCrypt = require('bcrypt-nodejs');

let createHash = (password) => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

let addAdmin = () => {
  return models.User.findOne({username: 'admin'},
          function (err, user) {
            if (err) {
              throw err;
            }
            if (user) {
              console.log('Admin exists.');
              return;
            }
            if (!user) {
              addAdmin();
              let admin = new models.User();
              admin.username = 'admin';
              admin.password = createHash('admin');
              admin.role = 'admin';
              admin.save(function (err) {
                if (err) {
                  console.log('Error in Saving user: ' + err);
                  throw err;
                  //return next(err);
                }
                console.log('Admin has been added.');
                return;
              });
            }
          }
  );
};
module.exports = addAdmin;