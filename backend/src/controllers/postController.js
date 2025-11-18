const Post = require('../models/Post');
const Creator = require('../models/Creator');
const User = require('../models/User');
const { handleControllerError } = require('../utils/errorHandler');
const { getPaginationParams, createPaginationMeta } = require('../utils/pagination');

// Get io instance from app
let io;
const setIo = (ioInstance) => {
  io = ioInstance;
};

// Get feed posts (for authenticated users)
const getFeed = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit, skip } = getPaginationParams(req.query, 20);

    // Get creators that the user follows
    const userCreator = await Creator.findOne({ user: userId });
    const followingCreatorIds = userCreator ? userCreator.following.map(f => f.creator) : [];

    // Include user's own posts if they are a creator
    const creatorIds = [...followingCreatorIds];
    if (userCreator) {
      creatorIds.push(userCreator._id);
    }

    // Get posts from followed creators and popular posts
    let posts;
    if (creatorIds.length > 0) {
      posts = await Post.find({
        creator: { $in: creatorIds },
        status: 'approved'
      })
        .populate('creator', 'displayName profilePicture isVerified')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
    } else {
      // For users not following anyone, show popular posts
      posts = await Post.find({ status: 'approved' })
        .populate('creator', 'displayName profilePicture isVerified')
        .sort({ 'engagement.likes': -1, 'engagement.comments': -1, createdAt: -1 })
        .limit(limit)
        .skip(skip);
    }

    res.json({
      posts,
      pagination: createPaginationMeta(page, limit, posts.length, posts) // Note: For simplicity, using posts.length as total, but ideally count total
    });
  } catch (error) {
    handleControllerError(error, 'fetching feed', res);
  }
};

// Get posts by creator
const getCreatorPosts = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const { page, limit, skip } = getPaginationParams(req.query, 20);
    const type = req.query.type; // 'post' or 'reel'

    const query = { creator: creatorId, status: 'approved' };
    if (type) query.type = type;

    const posts = await Post.find(query)
      .populate('creator', 'displayName profilePicture isVerified')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    res.json({
      posts,
      pagination: createPaginationMeta(page, limit, posts.length, posts)
    });
  } catch (error) {
    handleControllerError(error, 'fetching creator posts', res);
  }
};

// Get single post
const getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('creator', 'displayName profilePicture isVerified user')
      .populate('comments.user', 'name profilePhoto')
      .populate('likes.user', 'name profilePhoto');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    handleControllerError(error, 'fetching post', res);
  }
};

// Create new post/reel
const createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, caption, hashtags, mentions, location, category, music } = req.body;

    // Check if user is a verified creator
    const creator = await Creator.findOne({ user: userId, isVerified: true, accountStatus: 'active' });
    if (!creator) {
      return res.status(403).json({ error: 'Only verified educational content creators can post' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'At least one media file is required' });
    }

    // Process uploaded media files
    const media = req.files.map(file => ({
      type: file.mimetype.startsWith('image/') ? 'image' : 'video',
      url: file.path,
      width: file.width || null,
      height: file.height || null,
      duration: file.duration || null
    }));

    const post = new Post({
      creator: creator._id,
      type,
      caption,
      media,
      hashtags: hashtags ? hashtags.split(',').map(tag => tag.trim().toLowerCase().replace('#', '')) : [],
      mentions: mentions ? JSON.parse(mentions) : [],
      location,
      category: category || 'education',
      music: type === 'reel' ? music : undefined,
      status: 'pending'
    });

    await post.save();

    // Update creator stats
    await Creator.findByIdAndUpdate(creator._id, {
      $inc: { [`stats.${type}s`]: 1 }
    });

    const populatedPost = await Post.findById(post._id)
      .populate('creator', 'displayName profilePicture isVerified');

    // Emit real-time dashboard update for posts count
    if (io) {
      io.to(userId).emit('dashboardUpdate', {
        type: 'posts_update',
        posts: await Post.countDocuments({ creator: creator._id })
      });
    }

    res.status(201).json(populatedPost);
  } catch (error) {
    handleControllerError(error, 'creating post', res);
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user owns this post
    const creator = await Creator.findOne({ user: userId });
    if (!creator || post.creator.toString() !== creator._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updates, { new: true })
      .populate('creator', 'displayName profilePicture isVerified');

    res.json(updatedPost);
  } catch (error) {
    handleControllerError(error, 'updating post', res);
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user owns this post
    const creator = await Creator.findOne({ user: userId });
    if (!creator || post.creator.toString() !== creator._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(postId);

    // Update creator stats
    await Creator.findByIdAndUpdate(creator._id, {
      $inc: { [`stats.${post.type}s`]: -1 }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    handleControllerError(error, 'deleting post', res);
  }
};

// Like/Unlike post
const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const existingLike = post.likes.find(like => like.user.toString() === userId);

    if (existingLike) {
      // Unlike
      post.likes = post.likes.filter(like => like.user.toString() !== userId);
    } else {
      // Like
      post.likes.push({ user: userId });
    }

    await post.save();

    res.json({
      liked: !existingLike,
      likeCount: post.likes.length
    });
  } catch (error) {
    handleControllerError(error, 'toggling like', res);
  }
};

// Add comment to post
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    post.comments.push({
      user: userId,
      userName: user.name,
      content: content.trim()
    });

    await post.save();

    const newComment = post.comments[post.comments.length - 1];
    await Post.populate(newComment, { path: 'user', select: 'name profilePhoto' });

    res.status(201).json(newComment);
  } catch (error) {
    handleControllerError(error, 'adding comment', res);
  }
};

// Get trending posts
const getTrendingPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const posts = await Post.find({ status: 'approved' })
      .populate('creator', 'displayName profilePicture isVerified')
      .sort({ 'engagement.likes': -1, 'engagement.comments': -1, createdAt: -1 })
      .limit(limit);

    res.json(posts);
  } catch (error) {
    handleControllerError(error, 'fetching trending posts', res);
  }
};

// Search posts
const searchPosts = async (req, res) => {
  try {
    const { q, category, type } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    let query = { status: 'approved' };

    if (q) {
      query.$text = { $search: q };
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    const posts = await Post.find(query)
      .populate('creator', 'displayName profilePicture isVerified')
      .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit
      }
    });
  } catch (error) {
    handleControllerError(error, 'searching posts', res);
  }
};

module.exports = {
  setIo,
  getFeed,
  getCreatorPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getTrendingPosts,
  searchPosts
};