const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  points_reward: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  criteria: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  end_date: {
    type: Date,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Challenge', challengeSchema);
