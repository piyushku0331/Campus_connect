const User = require('../models/User');

const formatUserResponse = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  age: user.age,
  department: user.department,
  semester: user.semester,
  campus: user.campus,
  year: user.year,
  phone: user.phone,
  bio: user.bio,
  linkedin: user.linkedin,
  github: user.github,
  website: user.website,
  skills: user.skills,
  interests: user.interests,
  profilePicture: user.profilePicture,
  avatar_url: user.avatar_url,
  isPublic: user.isPublic,
  role: user.role,
  points: user.points,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password -otp -otpExpires -refreshToken -refreshTokenExpires -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(formatUserResponse(user));
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const allowedFields = ['name', 'bio', 'department', 'semester', 'campus', 'year', 'phone', 'linkedin', 'github', 'website', 'skills', 'interests', 'profilePicture', 'avatar_url', 'age'];
    const updateData = {};

    // Build update data from allowed fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = field === 'age' ? parseInt(req.body[field]) : req.body[field];
      }
    });

    // Handle file upload
    if (req.file && req.file.cloudinaryUrl) {
      updateData.profilePicture = req.file.cloudinaryUrl;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password -otp -otpExpires -refreshToken -refreshTokenExpires -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(formatUserResponse(user));
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('name avatar_url department semester age createdAt');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user._id,
      name: user.name,
      avatar_url: user.avatar_url,
      department: user.department,
      semester: user.semester,
      age: user.age,
      created_at: user.createdAt
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const searchUsers = async (req, res) => {
  try {
    const { query, major, year, age } = req.query;
    let mongoQuery = {};
    if (query) {
      mongoQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ];
    }
    if (major) {
      mongoQuery.department = major;
    }
    if (year) {
      mongoQuery.semester = year;
    }
    if (age) {
      mongoQuery.age = parseInt(age);
    }
    const users = await User.find(mongoQuery)
      .select('name avatar_url department semester age')
      .limit(20);
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      avatar_url: user.avatar_url,
      department: user.department,
      semester: user.semester,
      age: user.age
    }));
    res.json(formattedUsers);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const togglePrivacy = async (req, res) => {
  try {
    const userId = req.user.id;
    const { isPublic } = req.body;

    if (typeof isPublic !== 'boolean') {
      return res.status(400).json({ error: 'isPublic must be a boolean value' });
    }

    const user = await User.findByIdAndUpdate(userId, { isPublic }, { new: true }).select('-password -otp -otpExpires -refreshToken -refreshTokenExpires -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: `Profile is now ${isPublic ? 'public' : 'private'}`,
      isPublic: user.isPublic
    });
  } catch (error) {
    console.error('Error toggling privacy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  togglePrivacy,
  getUserById,
  searchUsers
};
