// Blog model for Campus Connect - stores user-contributed articles and research
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    enum: ['article', 'research', 'tutorial', 'opinion', 'news', 'other'],
    default: 'article'
  },
  featuredImage: {
    type: String // Cloudinary URL
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  views: {
    type: Number,
    default: 0
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
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userName: String,
    content: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  readingTime: {
    type: Number, // in minutes
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
blogSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
blogSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Index for search
blogSchema.index({ title: 'text', content: 'text', tags: 'text' });
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ status: 1, createdAt: -1 });
blogSchema.index({ tags: 1 });

// Pre-save middleware to calculate reading time
blogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Rough estimate: 200 words per minute
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }

  // Generate excerpt if not provided
  if (!this.excerpt && this.content) {
    this.excerpt = this.content.substring(0, 300) + (this.content.length > 300 ? '...' : '');
  }

  next();
});

module.exports = mongoose.model('Blog', blogSchema);