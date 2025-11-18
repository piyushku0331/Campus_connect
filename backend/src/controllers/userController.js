const User = require('../models/User');

const formatUserResponse = (user) => {
  return {
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
    profilePhoto: user.profilePhoto,
    isPublic: user.isPublic,
    role: user.role,
    points: user.points,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

const formatAlumniResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    department: user.department,
    batch: user.batch,
    company: user.company,
    position: user.position,
    location: user.location,
    bio: user.bio,
    linkedin: user.linkedin,
    email: user.email,
    profilePhoto: user.profilePhoto,
    alumniAchievements: user.alumniAchievements,
    successStory: user.successStory
  };
};

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
    const allowedFields = ['name', 'bio', 'department', 'semester', 'campus', 'year', 'phone', 'linkedin', 'github', 'website', 'skills', 'interests', 'age'];
    const updateData = {};

    // Build update data from allowed fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'age') {
          updateData[field] = parseInt(req.body[field]);
        } else if (field === 'skills' || field === 'interests') {
          // Parse JSON strings back to arrays
          try {
            updateData[field] = JSON.parse(req.body[field]);
          } catch (e) {
            updateData[field] = [];
          }
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    // Handle file upload
    if (req.file) {
      updateData.profilePhoto = req.file.path; // Cloudinary URL
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
      profilePhoto: user.profilePhoto,
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
      .select('name profilePhoto department semester age')
      .limit(20);
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      profilePhoto: user.profilePhoto,
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

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user points
    const user = await User.findById(userId).select('points');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get connections count
    const connectionsCount = await require('../models/Connection').countDocuments({
      $or: [{ sender_id: userId }, { receiver_id: userId }],
      status: 'accepted'
    });

    // Get events attended count
    const eventsAttendedCount = await require('../models/EventAttendee').countDocuments({
      user_id: userId,
      status: 'attending'
    });

    // Get posts count (posts created by user's creator account)
    const creator = await require('../models/Creator').findOne({ user: userId });
    const postsCount = creator ? await require('../models/Post').countDocuments({
      creator: creator._id
    }) : 0;

    res.json({
      points: user.points || 0,
      connections: connectionsCount,
      eventsAttended: eventsAttendedCount,
      posts: postsCount
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAlumni = async (req, res) => {
  try {
    const alumni = await User.find({ role: 'alumni' })
      .select('name department batch company position location bio linkedin email profilePhoto alumniAchievements successStory')
      .sort({ createdAt: -1 });

    const formattedAlumni = alumni.map(formatAlumniResponse);
    res.json(formattedAlumni);
  } catch (error) {
    console.error('Error fetching alumni:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  togglePrivacy,
  getUserById,
  searchUsers,
  getDashboardStats,
  getAlumni
};
