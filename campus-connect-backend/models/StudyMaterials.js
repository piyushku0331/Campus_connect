const mongoose = require('mongoose');

const StudyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  semester: { type: String, required: true },
  university: { type: String, required: true },
  filePath: { type: String, required: true }, // Path to the uploaded file
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('StudyMaterial', StudyMaterialSchema);