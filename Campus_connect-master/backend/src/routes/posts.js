const express = require('express');
const jwt = require('jsonwebtoken');
const { config } = require('../config');
const User = require('../models/User');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const router = express.Router();

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = { id: user._id };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, type, user_id } = req.query;
    const skip = (page - 1) * parseInt(limit);

    let query = {};
    if (type) {
      query.type = type;
    }
    if (user_id) {
      query.user_id = user_id;
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('user_id', 'name avatar_url department')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Post.countDocuments(query)
    ]);

    const formattedPosts = posts.map(post => ({
      id: post._id,
      content: post.content,
      type: post.type,
      title: post.title,
      metadata: post.metadata,
      created_at: post.created_at,
      updated_at: post.updated_at,
      profiles: {
        name: post.user_id.name,
        avatar_url: post.user_id.avatar_url,
        department: post.user_id.department
      }
    }));

    res.json({
      posts: formattedPosts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id).populate('user_id', 'name avatar_url department');
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const formattedPost = {
      id: post._id,
      content: post.content,
      type: post.type,
      title: post.title,
      metadata: post.metadata,
      created_at: post.created_at,
      updated_at: post.updated_at,
      profiles: {
        name: post.user_id.name,
        avatar_url: post.user_id.avatar_url,
        department: post.user_id.department
      }
    };

    res.json(formattedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});
router.post('/', verifyToken, async (req, res) => {
  try {
    const { content, type, title, metadata } = req.body;
    if (!content || !type) {
      return res.status(400).json({ error: 'Content and type are required' });
    }

    const post = new Post({
      user_id: req.user.id,
      content,
      type,
      title,
      metadata: metadata || {}
    });

    await post.save();
    await post.populate('user_id', 'name avatar_url department');

    const formattedPost = {
      id: post._id,
      content: post.content,
      type: post.type,
      title: post.title,
      metadata: post.metadata,
      created_at: post.created_at,
      updated_at: post.updated_at,
      profiles: {
        name: post.user_id.name,
        avatar_url: post.user_id.avatar_url,
        department: post.user_id.department
      }
    };

    res.status(201).json(formattedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, title, metadata } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.user_id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    post.content = content || post.content;
    post.title = title || post.title;
    post.metadata = metadata || post.metadata;

    await post.save();
    await post.populate('user_id', 'name avatar_url department');

    const formattedPost = {
      id: post._id,
      content: post.content,
      type: post.type,
      title: post.title,
      metadata: post.metadata,
      created_at: post.created_at,
      updated_at: post.updated_at,
      profiles: {
        name: post.user_id.name,
        avatar_url: post.user_id.avatar_url,
        department: post.user_id.department
      }
    };

    res.json(formattedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.user_id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});
router.post('/:id/like', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existingLike = await Like.findOne({ user_id: userId, note_id: id });
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      res.json({ liked: false, message: 'Post unliked' });
    } else {
      const like = new Like({
        user_id: userId,
        note_id: id
      });
      await like.save();
      res.json({ liked: true, message: 'Post liked' });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});
router.get('/:id/likes', async (req, res) => {
  try {
    const { id } = req.params;
    const likes = await Like.find({ note_id: id })
      .populate('user_id', 'name avatar_url')
      .sort({ created_at: -1 });

    const formattedLikes = likes.map(like => ({
      id: like._id,
      created_at: like.created_at,
      profiles: {
        name: like.user_id.name,
        avatar_url: like.user_id.avatar_url
      }
    }));

    res.json(formattedLikes);
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ error: 'Failed to fetch likes' });
  }
});
router.post('/:id/comments', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    const comment = new Comment({
      user_id: req.user.id,
      note_id: id,
      content
    });

    await comment.save();
    await comment.populate('user_id', 'name avatar_url');

    const formattedComment = {
      id: comment._id,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      profiles: {
        name: comment.user_id.name,
        avatar_url: comment.user_id.avatar_url
      }
    };

    res.status(201).json(formattedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});
router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * parseInt(limit);

    const comments = await Comment.find({ note_id: id })
      .populate('user_id', 'name avatar_url')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const formattedComments = comments.map(comment => ({
      id: comment._id,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      profiles: {
        name: comment.user_id.name,
        avatar_url: comment.user_id.avatar_url
      }
    }));

    res.json(formattedComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});
module.exports = router;
