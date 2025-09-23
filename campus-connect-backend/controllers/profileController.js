const User = require('../models/User');
const logger = require('../config/winston');

// @desc    Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    // Add logic here to check for private profiles if needed
    res.json(user);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, campus, skills, interests, isPublic } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id, // from authMiddleware
      { name, campus, skills, interests, isPublic },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};