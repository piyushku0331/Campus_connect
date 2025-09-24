const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (temporary for development)
router.get('/', authMiddleware, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// @desc    Update user role (temporary for development)
// @route   PUT /api/users/:id/role
// @access  Public (temporary)
router.put('/:id/role', async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Admin
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: 'User removed' });
});

module.exports = router;