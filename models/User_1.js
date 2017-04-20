'use strict';
const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
//let validateEmail = (email) => {
//  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//  return re.test(email);
//};

let userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    match: [/^[a-z0-9]+$/, "Username Incorrect"],
    unique: [true, "Username must be unique"]
  },
  // email: {
  //     type: String,
  //     trim: true,
  //     lowercase: true,
  //     unique: true,
  //     required: 'Email address is required',
  //     validate: [validateEmail, 'Please fill a valid email address'],
  //     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  // },
  password: {
    type: String,
//    maxlength: [32, "too Long"],
//    minlength: [4, "too Short"],
//    match: [/^[A-Za-z0-9]+$/, "password incorrect"],
    required: [true, "password is required"]
  },
  role: {
    type: String,
    default: 'guest'
  },
  fb: {
    id: String,
    access_token: String,
    firstName: String,
    lastName: String,
    email: String
  },
  twitter: {
    id: String,
    token: String,
    username: String,
    displayName: String,
    lastStatus: String
  }
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);