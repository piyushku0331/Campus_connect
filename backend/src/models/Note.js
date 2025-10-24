const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Add index for user queries
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true // Add index for title searches
  },
  description: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    index: true // Add index for subject filtering
  },
  semester: {
    type: String,
    required: true,
    trim: true,
    index: true // Add index for semester filtering
  },
  file_url: {
    type: String,
    trim: true
  },
  file_type: {
    type: String,
    trim: true,
    index: true // Add index for file type filtering
  },
  file_size: {
    type: Number
  },
  tags: [{
    type: String,
    trim: true,
    index: true // Add index for tag filtering
  }],
  downloads_count: {
    type: Number,
    default: 0,
    index: true // Add index for popular notes
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

noteSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Note', noteSchema);
