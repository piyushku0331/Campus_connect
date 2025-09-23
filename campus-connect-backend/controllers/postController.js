const Post = require('../models/Post');
const logger = require('../config/winston');

// @desc    Create a new post
exports.createPost = async (req, res) => {
  try {
    const newPost = new Post({ content: req.body.content, author: req.user.id });
    const post = await newPost.save();
    await post.populate('author', 'name profilePicture');
    res.status(201).json(post);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name profilePicture')
      .populate('comments.user', 'name profilePicture')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Like a post
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.user.id)) {
      // Unlike post
      post.likes.pull(req.user.id);
    } else {
      // Like post
      post.likes.push(req.user.id);
    }
    await post.save();
    res.json(post.likes);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};