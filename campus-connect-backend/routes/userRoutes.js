const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Admin
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: 'User removed' });
});

module.exports = router;