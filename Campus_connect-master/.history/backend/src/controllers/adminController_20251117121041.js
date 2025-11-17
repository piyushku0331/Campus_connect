
const User = require('../models/User');
const Post = require('../models/Post');
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
