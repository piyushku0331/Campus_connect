const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
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
  location: {
    type: String,
    required: true,
    index: true // Add index for location searches
  },
  start_date: {
    type: Date,
    required: true,
    index: true // Add index for date-based queries
  },
  end_date: {
    type: Date,
    required: true
  },
  organizer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Add index for organizer queries
  },
  max_attendees: {
    type: Number,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    index: true // Add index for tag filtering
  }],
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

eventSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('Event', eventSchema);
