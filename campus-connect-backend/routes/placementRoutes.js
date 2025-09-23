const express = require('express');
const router = express.Router();
const { postPlacement, getPlacements, getSuccessStories } = require('../controllers/PlacementController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', authMiddleware, adminMiddleware, postPlacement);
router.get('/', getPlacements);
router.get('/success-stories', getSuccessStories);

module.exports = router;