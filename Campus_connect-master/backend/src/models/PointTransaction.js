const mongoose = require('mongoose');

const pointTransactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  transaction_type: {
    type: String,
    enum: ['earned', 'spent'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  reference_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PointTransaction', pointTransactionSchema);
