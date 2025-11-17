// Creator model for educational content creators in Campus Connect
const mongoose = require('mongoose');

const creatorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Creator profile
  displayName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  bio: {
    type: String,
    maxlength: 150,
    trim: true
  },
  profilePicture: {
    type: String // Cloudinary URL
  },
  coverImage: {
    type: String // Cloudinary URL
  },
  // Creator verification and status
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  verificationDocuments: [{
    type: String, // Cloudinary URLs for certificates, IDs, etc.
    documentType: {
      type: String,
      enum: ['certificate', 'id', 'transcript', 'award', 'other']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  expertise: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  education: {
    degree: String,
    field: String,
    institution: String,
    graduationYear: Number
  },
  // Social metrics
  followers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    followedAt: {
      type: Date,
      default: Date.now
    }
  }],
  following: [{
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Creator'
    },
    followedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Content statistics
  stats: {
    posts: { type: Number, default: 0 },
    reels: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    totalShares: { type: Number, default: 0 }
  },
  // Creator settings
  isPrivate: {
    type: Boolean,
    default: false
  },
  allowMessages: {
    type: Boolean,
    default: true
  },
  contentCategories: [{
    type: String,
    enum: ['education', 'technology', 'science', 'career', 'study-tips', 'research', 'tutorials', 'motivation', 'other']
  }],
  // Monetization (future feature)
  monetizationEnabled: {
    type: Boolean,
    default: false
  },
  subscriptionPrice: {
    type: Number,
    min: 0,
    default: 0
  },
  // Content schedule
  postingSchedule: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'biweekly', 'monthly', 'irregular']
    },
    preferredDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    preferredTimes: [String] // e.g., ["09:00", "15:00"]
  },
  // Analytics
  lastActive: {
    type: Date,
    default: Date.now
  },
  accountStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'banned'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for follower count
creatorSchema.virtual('followerCount').get(function() {
  return this.followers.length;
});

// Virtual for following count
creatorSchema.virtual('followingCount').get(function() {
  return this.following.length;
});

// Virtual for total engagement
creatorSchema.virtual('totalEngagement').get(function() {
  return this.stats.totalLikes + this.stats.totalComments + this.stats.totalShares;
});

// Index for search and queries
creatorSchema.index({ user: 1 });
creatorSchema.index({ displayName: 'text', bio: 'text' });
creatorSchema.index({ isVerified: 1, verificationStatus: 1 });
creatorSchema.index({ expertise: 1 });
creatorSchema.index({ contentCategories: 1 });
creatorSchema.index({ 'stats.totalViews': -1, 'stats.totalLikes': -1 });
creatorSchema.index({ accountStatus: 1, lastActive: -1 });

// Pre-save middleware to update stats
creatorSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

// Static method to get popular creators
creatorSchema.statics.getPopularCreators = function(limit = 10) {
  return this.find({ isVerified: true, accountStatus: 'active' })
    .sort({ 'stats.totalViews': -1, 'stats.totalLikes': -1 })
    .limit(limit)
    .populate('user', 'name profilePhoto');
};

// Static method to get creators by category
creatorSchema.statics.getCreatorsByCategory = function(category, limit = 20) {
  return this.find({
    isVerified: true,
    accountStatus: 'active',
    contentCategories: category
  })
    .sort({ 'stats.totalViews': -1 })
    .limit(limit)
    .populate('user', 'name profilePhoto');
};

module.exports = mongoose.model('Creator', creatorSchema);