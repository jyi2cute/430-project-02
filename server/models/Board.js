const mongoose = require('mongoose');
const _ = require('underscore');

const setTitle = (title) => _.escape(title).trim();
const setDescription = (description) => _.escape(description).trim();
const setCategory = (category) => _.escape(category).trim();

// image model (schema) function
const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    trim: true,
    default: 'Untitled Image',
  },
  uploadedDate: {
    type: Date,
    default: Date.now,
  },
});

// board model (schema) function
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
  images: {
    type: [ImageSchema],
    required: false,
    default: [],
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

// Converts a doc to something we can store in redis later on.
BoardSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  description: doc.description,
  category: doc.category,
  _id: doc._id,
  images: doc.images || [],
});

const BoardModel = mongoose.model('Board', BoardSchema);
module.exports = {
  BoardModel,
  mongoose,
};
