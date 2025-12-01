const mongoose = require('mongoose');
const _ = require('underscore');

const setTitle = (title) => _.escape(title).trim();
const setDescription = (description) => _.escape(description).trim();
const setCategory = (category) => _.escape(category).trim();

const BoardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    set: setDescription,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    set: setCategory,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

BoardSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  description: doc.description,
  category: doc.category,
  _id: doc._id,
});

const BoardModel = mongoose.model('Board', BoardSchema);
module.exports = BoardModel;
