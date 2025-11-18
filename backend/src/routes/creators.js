const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { creatorController } = require('../controllers');

// Public routes
router.get('/suggested', verifyToken, creatorController.getSuggestedCreators);
router.get('/:creatorId', creatorController.getPublicCreatorProfile);
router.post('/:creatorId/follow', verifyToken, creatorController.toggleFollow);

// Protected routes (require authentication)
router.post('/apply', verifyToken, creatorController.applyForCreator);
router.get('/profile/me', verifyToken, creatorController.getCreatorProfile);
router.put('/profile/me', verifyToken, creatorController.updateCreatorProfile);

// Admin routes (TODO: Add admin middleware)
router.get('/admin/pending', creatorController.getPendingApplications);
router.post('/:creatorId/review', creatorController.reviewCreatorApplication);

module.exports = router;