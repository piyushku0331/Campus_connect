const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true // Add index for title searches
  },
  description: {
    type: String,
    required: true
  },
  file_url: {
    type: String,
    required: true
  },
  file_type: {
    type: String,
    required: true,
    index: true // Add index for file type filtering
  },
  uploader_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Add index for uploader queries
  },
  tags: [{
    type: String,
    trim: true,
    index: true // Add index for tag filtering
  }],
  download_count: {
    type: Number,
    default: 0,
    index: true // Add index for popular resources
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true // Add index for chronological queries
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

resourceSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Resource', resourceSchema);
