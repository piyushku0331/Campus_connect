const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true,
    index: true
  },
  category: {
    type: String,
    enum: ['Electronics', 'Documents', 'Books', 'Clothing', 'Personal Items', 'Other'],
    default: 'Other',
    index: true
  },
  imagePath: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Lost', 'Found'],
    default: 'Lost',
    index: true
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
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

lostItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('LostItem', lostItemSchema);