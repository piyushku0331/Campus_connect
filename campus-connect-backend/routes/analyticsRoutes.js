const express = require('express');
const router = express.Router();
const { getStats, getPopularEvents } = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/stats', authMiddleware, adminMiddleware, getStats);
router.get('/popular-events', authMiddleware, adminMiddleware, getPopularEvents);

module.exports = router;