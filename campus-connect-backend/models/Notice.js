const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: ['Exams', 'Results', 'Scholarships', 'General'],
    required: true
  },
  filePath: { type: String, required: true } 
}, { timestamps: true });

module.exports = mongoose.model('Notice', NoticeSchema);