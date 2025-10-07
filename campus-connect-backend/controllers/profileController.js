const User = require('../models/User');
const logger = require('../config/winston');
const multer = require('multer');
const path = require('path');


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
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    res.json(user);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send('Server Error');
  }
};


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

    
    if (req.file) {
      updateData.profilePicture = req.file.filename;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id, 
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


exports.uploadProfilePicture = upload.single('profilePicture');