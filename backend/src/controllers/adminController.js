const User = require('../models/User');
const Post = require('../models/Post');
const Resource = require('../models/Resource');
const Notice = require('../models/Notice');
const Event = require('../models/Event');
const LostItem = require('../models/LostItem');

// Analytics Dashboard
const getAnalytics = async (req, res) => {
  try {
    // User metrics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isVerified: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });

    // Content metrics
    const totalPosts = await Post.countDocuments();
    const totalNotices = await Notice.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalLostItems = await LostItem.countDocuments();

    // Engagement metrics (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentPosts = await Post.countDocuments({ created_at: { $gte: thirtyDaysAgo } });
    const recentEvents = await Event.countDocuments({ created_at: { $gte: thirtyDaysAgo } });

    // User registration trend (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const userRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      userMetrics: {
        totalUsers,
        activeUsers,
        adminUsers
      },
      contentMetrics: {
        totalPosts,
        totalNotices,
        totalEvents,
        totalLostItems
      },
      engagementMetrics: {
        recentPosts,
        recentEvents
      },
      userRegistrations
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// User Management
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password -otp -otpExpires -refreshToken -refreshTokenExpires -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin', 'faculty'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true })
      .select('-password -otp -otpExpires -refreshToken -refreshTokenExpires -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // TODO: Clean up related data (posts, comments, etc.)

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Content Moderation
const getContentForModeration = async (req, res) => {
  try {
    const { type = 'all', page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let content = [];

    if (type === 'posts' || type === 'all') {
      const posts = await Post.find({ status: 'pending' })
        .populate('creator', 'displayName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      content.push(...posts.map(post => ({ ...post.toObject(), contentType: 'post' })));
    }

    if (type === 'resources' || type === 'all') {
      const resources = await Resource.find({ status: 'pending' })
        .populate('uploader_id', 'name')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      content.push(...resources.map(resource => ({ ...resource.toObject(), contentType: 'resource' })));
    }

    if (type === 'events' || type === 'all') {
      const events = await Event.find({ status: 'pending' })
        .populate('organizer_id', 'name')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      content.push(...events.map(event => ({ ...event.toObject(), contentType: 'event' })));
    }

    if (type === 'notices' || type === 'all') {
      const notices = await Notice.find({ status: 'pending' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      content.push(...notices.map(notice => ({ ...notice.toObject(), contentType: 'notice' })));
    }

    // Sort combined content by creation date
    content.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      content: content.slice(0, limit),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: content.length,
        pages: Math.ceil(content.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching content for moderation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const moderateContent = async (req, res) => {
  try {
    const { id, contentType, action } = req.body;
    const io = req.app.get('io'); // Get socket.io instance

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const status = action === 'approve' ? 'approved' : 'rejected';

    let content;
    let userId;

    if (contentType === 'post') {
      content = await Post.findByIdAndUpdate(id, { status }, { new: true }).populate('creator');
      userId = content?.creator?.user;
    } else if (contentType === 'resource') {
      content = await Resource.findByIdAndUpdate(id, { status }, { new: true });
      userId = content?.uploader_id;
    } else if (contentType === 'event') {
      content = await Event.findByIdAndUpdate(id, { status }, { new: true });
      userId = content?.organizer_id;
    } else if (contentType === 'notice') {
      content = await Notice.findByIdAndUpdate(id, { status }, { new: true });
      // Notices don't have uploader_id, assume admin uploaded
      userId = null;
    } else {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Emit real-time notification to the uploader
    if (io && userId) {
      io.to(userId.toString()).emit('contentApproval', {
        contentType,
        contentId: id,
        status,
        title: content.title || content.caption || 'Your content'
      });
    }

    res.json({ message: `Content ${action}d successfully`, content });
  } catch (error) {
    console.error('Error moderating content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Event Management
const getPendingEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const events = await Event.find({ status: 'pending' })
      .populate('organizer_id', 'name email')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Event.countDocuments({ status: 'pending' });

    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching pending events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const approveEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, { status: 'approved' }, { new: true })
      .populate('organizer_id', 'name email');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event approved successfully', event });
  } catch (error) {
    console.error('Error approving event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const rejectEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event rejected successfully', event });
  } catch (error) {
    console.error('Error rejecting event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Alumni Management
const getAlumni = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const alumni = await User.find({ role: 'alumni' })
      .select('-password -otp -otpExpires -refreshToken -refreshTokenExpires -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments({ role: 'alumni' });

    res.json({
      alumni,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching alumni:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addAlumni = async (req, res) => {
  try {
    const { userId } = req.body;
    const io = req.app.get('io'); // Get socket.io instance

    const user = await User.findByIdAndUpdate(userId, { role: 'alumni' }, { new: true })
      .select('-password -otp -otpExpires -refreshToken -refreshTokenExpires -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Emit real-time update to all connected clients
    if (io) {
      io.emit('alumniAdded', {
        type: 'alumni_added',
        user: {
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
        }
      });
    }

    res.json({ message: 'User added to alumni successfully', user });
  } catch (error) {
    console.error('Error adding alumni:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const io = req.app.get('io'); // Get socket.io instance

    // Only allow updating alumni-specific fields
    const allowedFields = ['batch', 'company', 'position', 'location', 'alumniAchievements', 'successStory'];
    const filteredUpdateData = {};

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredUpdateData[field] = updateData[field];
      }
    });

    const user = await User.findByIdAndUpdate(id, filteredUpdateData, { new: true })
      .select('-password -otp -otpExpires -refreshToken -refreshTokenExpires -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    // Emit real-time update to all connected clients
    if (io) {
      io.emit('alumniUpdated', {
        type: 'alumni_updated',
        user: {
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
        }
      });
    }

    res.json({ message: 'Alumni updated successfully', user });
  } catch (error) {
    console.error('Error updating alumni:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    const io = req.app.get('io'); // Get socket.io instance

    const user = await User.findByIdAndUpdate(id, { role: 'user' }, { new: true })
      .select('-password -otp -otpExpires -refreshToken -refreshTokenExpires -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    // Emit real-time update to all connected clients
    if (io) {
      io.emit('alumniRemoved', {
        type: 'alumni_removed',
        userId: id
      });
    }

    res.json({ message: 'Alumni removed successfully', user });
  } catch (error) {
    console.error('Error removing alumni:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAnalytics,
  getUsers,
  updateUserRole,
  deleteUser,
  getContentForModeration,
  moderateContent,
  getPendingEvents,
  approveEvent,
  rejectEvent,
  getAlumni,
  addAlumni,
  updateAlumni,
  removeAlumni
};