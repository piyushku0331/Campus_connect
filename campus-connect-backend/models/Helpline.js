const mongoose = require('mongoose');

const HelplineSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  contactPerson: { type: String }, // Optional contact person
  phoneNumber: { type: String, required: true },
  email: { type: String }, // Optional email address
  category: {
    type: String,
    enum: ['Medical', 'Security', 'Transport', 'General'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Helpline', HelplineSchema);