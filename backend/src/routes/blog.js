const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { uploadUserProfile } = require('../middleware/cloudinaryUpload');
const { blogController } = require('../controllers');

// Public routes
router.get('/', blogController.getBlogs);
router.get('/tags', blogController.getTags);
router.get('/:id', blogController.getBlogById);

// Protected routes
router.post('/', verifyToken, blogController.createBlog);
router.put('/:id', verifyToken, blogController.updateBlog);
router.delete('/:id', verifyToken, blogController.deleteBlog);
router.get('/user/my-posts', verifyToken, blogController.getUserBlogs);
router.post('/:id/like', verifyToken, blogController.toggleLike);
router.post('/:id/comment', verifyToken, blogController.addComment);

module.exports = router;