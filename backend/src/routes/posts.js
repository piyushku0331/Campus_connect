const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { uploadPostMedia } = require('../middleware/cloudinaryUpload');
const { postController } = require('../controllers');

// Public routes
router.get('/feed', verifyToken, postController.getFeed);
router.get('/trending', postController.getTrendingPosts);
router.get('/search', postController.searchPosts);
router.get('/creator/:creatorId', postController.getCreatorPosts);
router.get('/:postId', postController.getPost);

// Protected routes (require authentication)
router.post('/', verifyToken, uploadPostMedia, postController.createPost);
router.put('/:postId', verifyToken, postController.updatePost);
router.delete('/:postId', verifyToken, postController.deletePost);
router.post('/:postId/like', verifyToken, postController.toggleLike);
router.post('/:postId/comment', verifyToken, postController.addComment);

module.exports = router;
