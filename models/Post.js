'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: {
    type: [String, "unapropriate type"],
    required: [true, "title Required"],
    unique: [true, "title must be unique"],
    validate: /\S+/
  },
  content: {
    type: [String, "unapropriate type"],
    required: [true, "text Required"],
    validate: /\S+/
  },
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now},
  status: {
    type: [{
        type: String,
        enum: ['active', 'notpublished', 'private']
      }],
    default: ['active']
  },
  slug: String,
  author: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}]
});

PostSchema
        .virtual('url')
        .get(function () {
          return '/post/' + this._id;
        });

module.exports = mongoose.model('Post', PostSchema);
