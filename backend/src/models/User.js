const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true, // Add index for faster email lookups
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // Don't include password in queries by default
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true // Add index for name searches
  },
  age: {
    type: Number,
    required: true,
    min: 16,
    max: 30
  },
  department: {
    type: String,
    required: true,
    trim: true,
    index: true // Add index for department filtering
  },
  semester: {
    type: String,
    required: true,
    trim: true,
    index: true // Add index for semester filtering
  },
  avatar_url: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false,
    index: true // Add index for verified user queries
  },
  otp: {
    type: String,
    default: null,
    select: false // Don't include OTP in queries
  },
  otpExpires: {
    type: Date,
    default: null,
    index: true // Add index for OTP expiration queries
  },
  refreshToken: {
    type: String,
    default: null,
    select: false // Don't include refresh token in queries
  },
  refreshTokenExpires: {
    type: Date,
    default: null,
    index: true // Add index for token expiration queries
  },
  points: {
    type: Number,
    default: 0,
    index: true // Add index for leaderboard queries
  },
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Add index for chronological queries
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {

  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
module.exports = mongoose.model('User', userSchema);
