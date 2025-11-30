const mongoose = require('mongoose');

const { Schema, Types } = mongoose;

const DrawSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['line', 'rectangle', 'text'],
  },
  data: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });

const DrawboardSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: [DrawSchema],
    required: true,
    default: [],
  },
  visibility: {
    type: String,
    required: true,
    enum: ['private', 'public-view', 'public-edit'],
    default: 'private',
  },
  owner: {
    type: Types.ObjectId,
    required: true,
    ref: 'Account',
  },
  collaborators: {
    type: [Types.ObjectId],
    default: [],
    ref: 'Account',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

DrawboardSchema.methods.toAPI = function toAPI() {
  return {
    title: this.title,
    id: this._id,
    visibility: this.visibility,
  };
};

const DrawModel = mongoose.model('Draw', DrawboardSchema);

module.exports = {
  DrawModel,
  DrawSchema,
};
