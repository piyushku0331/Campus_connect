const express = require('express');
const Post = require('../models/Post');
const router = express.Router();
const { createPost, getAllPosts, likePost } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', authMiddleware, createPost);
router.get('/', getAllPosts);
router.put('/:id/like', authMiddleware, likePost);
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Post removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;