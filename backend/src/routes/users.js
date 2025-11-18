const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { uploadUserProfile } = require('../middleware/cloudinaryUpload');
const { userController } = require('../controllers');

router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, uploadUserProfile, userController.updateProfile);
router.patch('/privacy', verifyToken, userController.togglePrivacy);
router.get('/dashboard/stats', verifyToken, userController.getDashboardStats);
router.get('/alumni', userController.getAlumni); // Public route for alumni
router.get('/:id', verifyToken, userController.getUserById);
router.get('/', verifyToken, userController.searchUsers);

module.exports = router;
