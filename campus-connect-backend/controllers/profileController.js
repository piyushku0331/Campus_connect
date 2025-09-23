const User = require('../models/User');
const logger = require('../config/winston');
const multer = require('multer');
const path = require('path');

// Configure multer for profile picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

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
    const updateData = {};
    const allowedFields = ['name', 'campus', 'year', 'department', 'phone', 'bio', 'linkedin', 'github', 'website', 'skills', 'interests', 'isPublic'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'skills' || field === 'interests') {
          updateData[field] = Array.isArray(req.body[field]) ? req.body[field] : [];
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    // Handle profile picture if uploaded
    if (req.file) {
      updateData.profilePicture = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id, // from authMiddleware
      updateData,
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Export multer middleware for use in routes
exports.uploadProfilePicture = upload.single('profilePicture');