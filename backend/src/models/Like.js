const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  note_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});


likeSchema.index({ user_id: 1, note_id: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
