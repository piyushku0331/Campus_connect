// User model for Campus Connect - defines user data structure and behavior
const mongoose = require('mongoose'); // MongoDB ODM for Node.js
const bcrypt = require('bcryptjs'); // Password hashing library

// Define user schema with validation and security features
const userSchema = new mongoose.Schema({
  // Email field - primary identifier with domain restrictions
  email: {
    type: String,
    required: true, // Must be provided during registration
    unique: true, // Ensures no duplicate emails in database
    lowercase: true, // Store emails in lowercase for consistency
    index: true, // Database index for faster email lookups
    validate: {
      validator: function(email) {
        // Regex validation for proper email format
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Invalid email format'
    }
  },
  // Password field - securely stored with bcrypt hashing
  password: {
    type: String,
    required: true, // Must be provided during registration
    minlength: 6, // Minimum password length for security
    select: false // Don't include password in queries by default (security)
  },
  // User's full name
  name: {
    type: String,
    required: true, // Required for user identification
    trim: true, // Remove whitespace from start/end
    index: true // Database index for name searches and sorting
  },
  // User's age - restricted to typical student age range
  age: {
    type: Number,
    required: true,
    min: 16, // Minimum age for university students
    max: 30 // Maximum age to prevent invalid entries
  },
  // Academic department (e.g., Computer Science, Mechanical Engineering)
  department: {
    type: String,
    required: true,
    trim: true,
    index: true // Index for filtering users by department
  },
  // Current semester (e.g., "1st", "2nd", "3rd")
  semester: {
    type: String,
    required: true,
    trim: true,
    index: true // Index for filtering by semester
  },
  campus: {
    type: String,
    trim: true
  },
  year: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  // Alumni-specific fields
  batch: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  alumniAchievements: [{
    type: String,
    trim: true
  }],
  successStory: {
    type: String,
    trim: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  github: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  interests: [{
    type: String,
    trim: true
  }],
  profilePicture: {
    type: String,
    default: 'default-dp.png'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: {
    type: String,
    select: false
  },
  resetPasswordExpires: {
    type: Date,
    index: true
  },
  profilePhoto: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Email verification status
  isVerified: {
    type: Boolean,
    default: false, // Users must verify email before full access
    index: true // Index for queries filtering verified users
  },
  // One-time password for email verification
  otp: {
    type: String,
    default: null,
    select: false // Never include OTP in regular queries (security)
  },
  // OTP expiration timestamp
  otpExpires: {
    type: Date,
    default: null,
    index: true // Index for efficient OTP cleanup queries
  },
  // JWT refresh token for session management
  refreshToken: {
    type: String,
    default: null,
    select: false // Never include refresh token in regular queries
  },
  // Refresh token expiration timestamp
  refreshTokenExpires: {
    type: Date,
    default: null,
    index: true // Index for token expiration queries
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
// Pre-save middleware - automatically hash passwords before saving
userSchema.pre('save', async function(next) {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate salt with cost factor of 12 (higher = more secure but slower)
    const salt = await bcrypt.genSalt(12);
    // Hash the password with the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Continue with save operation
  } catch (error) {
    next(error); // Pass error to next middleware
  }
});

// Instance method to compare candidate password with stored hash
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Use bcrypt to compare plain text password with hashed password
  return bcrypt.compare(candidatePassword, this.password);
};

// Pre-save middleware - update timestamp on every save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now(); // Set updatedAt to current timestamp
  next(); // Continue with save operation
});
module.exports = mongoose.model('User', userSchema);
