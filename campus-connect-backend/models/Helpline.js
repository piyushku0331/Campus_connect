const mongoose = require('mongoose');

const HelplineSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  contactPerson: { type: String }, 
  phoneNumber: { type: String, required: true },
  email: { type: String }, 
  category: {
    type: String,
    enum: ['Medical', 'Security', 'Transport', 'General'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Helpline', HelplineSchema);