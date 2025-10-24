const mongoose = require('mongoose');

const userAchievementSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  achievement_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
    required: true
  },
  unlocked_at: {
    type: Date,
    default: Date.now
  }
});


userAchievementSchema.index({ user_id: 1, achievement_id: 1 }, { unique: true });

module.exports = mongoose.model('UserAchievement', userAchievementSchema);
