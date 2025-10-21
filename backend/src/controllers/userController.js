const User = require('../models/User');
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('-password -otp -otpExpires');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      age: user.age,
      department: user.department,
      semester: user.semester,
      avatar_url: user.avatar_url,
      role: user.role,
      points: user.points,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { full_name, bio, major, year, interests, avatar_url, age } = req.body;
    const updateData = {};
    if (full_name) updateData.name = full_name;
    if (bio) updateData.bio = bio;
    if (major) updateData.department = major;
    if (year) updateData.semester = year;
    if (interests) updateData.interests = interests;
    if (avatar_url) updateData.avatar_url = avatar_url;
    if (age) updateData.age = parseInt(age);
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password -otp -otpExpires');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      age: user.age,
      department: user.department,
      semester: user.semester,
      avatar_url: user.avatar_url,
      role: user.role,
      points: user.points,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
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
module.exports = {
  getProfile,
  updateProfile,
  getUserById,
  searchUsers
};
