const mongoose = require('mongoose');

const eventAttendeeSchema = new mongoose.Schema({
  event_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['attending', 'maybe', 'not_attending'],
    default: 'attending'
  },
  rsvp_date: {
    type: Date,
    default: Date.now
  }
});


eventAttendeeSchema.index({ event_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model('EventAttendee', eventAttendeeSchema);
