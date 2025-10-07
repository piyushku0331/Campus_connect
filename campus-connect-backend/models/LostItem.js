const mongoose = require('mongoose');

const LostItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String }, 
  category: { type: String, enum: ['Electronics', 'Documents', 'Books', 'Clothing', 'Personal Items', 'Other'], default: 'Other' },
  imagePath: { type: String }, 
  status: { type: String, enum: ['Lost', 'Found'], default: 'Lost' },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('LostItem', LostItemSchema);