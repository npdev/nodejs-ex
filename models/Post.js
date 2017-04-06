'use strict';

var mongoose = require('mongoose');
//const URLSlugs = require('mongoose-url-slugs');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: {
    type: [String, "unapropriate type"],
    required: [true, "title Required"],
    unique: [true, "title must be unique"]
  },
  content: {
    type: [String, "unapropriate type"],
    required: [true, "text Required"]
  },
  created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [{
        type: String,
        enum: ['active', 'notpublished', 'private']
      }],
    default: ['active']
  },
  slug: String
});

// Подключим генератор на основе названия
//PostSchema.plugin(URLSlugs('title'));

module.exports = mongoose.model('Post', PostSchema);
