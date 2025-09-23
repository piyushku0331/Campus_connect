const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  isVerified: { type: Boolean, default: false },
  role: {type: String, enum: ['Student', 'Admin'],default: 'Student'  },
  campus: { type: String },
  skills: [String],
  interests: [String],
  profilePicture: { type: String, default: 'default-dp.png' },
  isPublic: { type: Boolean, default: true },
  // Password reset fields
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);