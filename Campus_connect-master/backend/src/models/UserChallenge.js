const mongoose = require('mongoose');

const userChallengeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challenge_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'failed'],
    default: 'active'
  },
  progress: {
    type: Number,
    default: 0
  },
  completed_at: {
    type: Date,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});


userChallengeSchema.index({ user_id: 1, challenge_id: 1 }, { unique: true });

module.exports = mongoose.model('UserChallenge', userChallengeSchema);
