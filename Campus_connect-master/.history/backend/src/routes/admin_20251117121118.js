const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const { adminController } = require('../controllers');

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(requireAdmin);

// Analytics
router.get('/analytics', adminController.getAnalytics);

// User Management
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Content Moderation
router.get('/moderation', adminController.getContentForModeration);
router.post('/moderation', adminController.moderateContent);

module.exports = router;