'use strict';

const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
let userSchema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  role: {
    type: String,
    default: 'user'
  }

});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);