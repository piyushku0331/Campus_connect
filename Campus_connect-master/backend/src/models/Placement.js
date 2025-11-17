const mongoose = require('mongoose');

const placementSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  company: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    index: true
  },
  isSuccessStory: {
    type: Boolean,
    default: false,
    index: true
  },
  story: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

placementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Placement', placementSchema);