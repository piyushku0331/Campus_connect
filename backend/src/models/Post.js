// Post model for Instagram-like posts and reels in Campus Connect
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Creator',
    required: true
  },
  type: {
    type: String,
    enum: ['post', 'reel'],
    required: true
  },
  caption: {
    type: String,
    maxlength: 2200,
    trim: true
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    thumbnail: String, // For videos
    duration: Number, // For videos in seconds
    width: Number,
    height: Number
  }],
  hashtags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  location: {
    type: String,
    trim: true
  },
  // Instagram-like features
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: String,
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    replies: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      userName: String,
      content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  shares: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  // For reels
  music: {
    title: String,
    artist: String,
    url: String
  },
  // Engagement metrics
  engagement: {
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    saves: { type: Number, default: 0 }
  },
  // Approval status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reportedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // SEO and discoverability
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    enum: ['education', 'technology', 'science', 'career', 'study-tips', 'research', 'tutorials', 'motivation', 'other'],
    default: 'education'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total engagement
postSchema.virtual('totalEngagement').get(function() {
  return this.likes.length + this.comments.length + this.shares;
});

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Index for search and filtering
postSchema.index({ creator: 1, createdAt: -1 });
postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ 'engagement.likes': -1, 'engagement.comments': -1 });

// Pre-save middleware to update engagement metrics
postSchema.pre('save', function(next) {
  this.engagement.likes = this.likes.length;
  this.engagement.comments = this.comments.length;

  // Extract hashtags from caption
  if (this.caption) {
    const hashtagRegex = /#(\w+)/g;
    const foundHashtags = this.caption.match(hashtagRegex);
    if (foundHashtags) {
      this.hashtags = [...new Set([...(this.hashtags || []), ...foundHashtags.map(tag => tag.slice(1).toLowerCase())])];
    }
  }

  next();
});

module.exports = mongoose.model('Post', postSchema);
