const mongoose = require('mongoose');

const PlacementSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  year: { type: Number, required: true },
  isSuccessStory: { type: Boolean, default: false },
  story: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('Placement', PlacementSchema);