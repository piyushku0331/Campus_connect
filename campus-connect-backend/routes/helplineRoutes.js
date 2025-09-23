const express = require('express');
const router = express.Router();
const {
  getAllHelplines,
  addHelpline,
  updateHelpline,
  deleteHelpline,
} = require('../controllers/helplineController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public route
router.get('/', getAllHelplines);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, addHelpline);
router.put('/:id', authMiddleware, adminMiddleware, updateHelpline);
router.delete('/:id', authMiddleware, adminMiddleware, deleteHelpline);

module.exports = router;