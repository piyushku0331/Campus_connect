const Creator = require('../models/Creator');
const User = require('../models/User');

// Apply to become a creator
const applyForCreator = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      displayName,
      bio,
      expertise,
      education,
      contentCategories,
      portfolioUrl,
      socialLinks
    } = req.body;

    // Check if user already has a creator profile
    const existingCreator = await Creator.findOne({ user: userId });
    if (existingCreator) {
      return res.status(400).json({ error: 'Creator application already exists' });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const creator = new Creator({
      user: userId,
      displayName: displayName || user.name,
      bio,
      expertise: expertise ? expertise.split(',').map(item => item.trim()) : [],
      education,
      contentCategories: contentCategories ? contentCategories.split(',').map(item => item.trim()) : [],
      verificationStatus: 'pending'
    });

    await creator.save();

    res.status(201).json({
      message: 'Creator application submitted successfully',
      creator: {
        id: creator._id,
        displayName: creator.displayName,
        verificationStatus: creator.verificationStatus
      }
    });
  } catch (error) {
    console.error('Error applying for creator:', error);
    res.status(500).json({ error: 'Failed to submit creator application' });
  }
};

// Get creator profile
const getCreatorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const creator = await Creator.findOne({ user: userId })
      .populate('user', 'name email profilePhoto')
      .populate('followers.user', 'name profilePhoto')
      .populate('following.creator', 'displayName profilePicture');

    if (!creator) {
      return res.status(404).json({ error: 'Creator profile not found' });
    }

    res.json(creator);
  } catch (error) {
    console.error('Error fetching creator profile:', error);
    res.status(500).json({ error: 'Failed to fetch creator profile' });
  }
};

// Update creator profile
const updateCreatorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    const creator = await Creator.findOne({ user: userId });
    if (!creator) {
      return res.status(404).json({ error: 'Creator profile not found' });
    }

    // Prevent updating verification status through this endpoint
    delete updates.verificationStatus;
    delete updates.isVerified;

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        creator[key] = updates[key];
      }
    });

    await creator.save();

    res.json(creator);
  } catch (error) {
    console.error('Error updating creator profile:', error);
    res.status(500).json({ error: 'Failed to update creator profile' });
  }
};

// Get public creator profile
const getPublicCreatorProfile = async (req, res) => {
  try {
    const { creatorId } = req.params;

    const creator = await Creator.findById(creatorId)
      .populate('user', 'name profilePhoto')
      .select('-verificationDocuments -accountStatus');

    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    res.json(creator);
  } catch (error) {
    console.error('Error fetching public creator profile:', error);
    res.status(500).json({ error: 'Failed to fetch creator profile' });
  }
};

// Follow/Unfollow creator
const toggleFollow = async (req, res) => {
  try {
    const userId = req.user.id;
    const { creatorId } = req.params;

    if (creatorId === userId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const creator = await Creator.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    const userCreator = await Creator.findOne({ user: userId });
    if (!userCreator) {
      return res.status(400).json({ error: 'User must be a creator to follow others' });
    }

    const existingFollow = creator.followers.find(follow => follow.user.toString() === userId);
    const existingFollowing = userCreator.following.find(follow => follow.creator.toString() === creatorId);

    if (existingFollow && existingFollowing) {
      // Unfollow
      creator.followers = creator.followers.filter(follow => follow.user.toString() !== userId);
      userCreator.following = userCreator.following.filter(follow => follow.creator.toString() !== creatorId);
    } else {
      // Follow
      creator.followers.push({ user: userId });
      userCreator.following.push({ creator: creatorId });
    }

    await creator.save();
    await userCreator.save();

    res.json({
      followed: !existingFollow,
      followerCount: creator.followers.length
    });
  } catch (error) {
    console.error('Error toggling follow:', error);
    res.status(500).json({ error: 'Failed to toggle follow' });
  }
};

// Get suggested creators
const getSuggestedCreators = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 10;

    const userCreator = await Creator.findOne({ user: userId });
    const followingIds = userCreator ? userCreator.following.map(f => f.creator) : [];

    const creators = await Creator.find({
      user: { $ne: userId },
      _id: { $nin: followingIds },
      isVerified: true,
      accountStatus: 'active'
    })
      .populate('user', 'name profilePhoto')
      .sort({ 'stats.totalViews': -1 })
      .limit(limit);

    res.json(creators);
  } catch (error) {
    console.error('Error fetching suggested creators:', error);
    res.status(500).json({ error: 'Failed to fetch suggested creators' });
  }
};

// Admin: Get pending creator applications
const getPendingApplications = async (req, res) => {
  try {
    // TODO: Add admin check
    const applications = await Creator.find({ verificationStatus: 'pending' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching pending applications:', error);
    res.status(500).json({ error: 'Failed to fetch pending applications' });
  }
};

// Admin: Approve/Reject creator application
const reviewCreatorApplication = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const { action, reason } = req.body; // action: 'approve' or 'reject'

    // TODO: Add admin check
    const creator = await Creator.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ error: 'Creator application not found' });
    }

    if (action === 'approve') {
      creator.verificationStatus = 'approved';
      creator.isVerified = true;
    } else if (action === 'reject') {
      creator.verificationStatus = 'rejected';
      // TODO: Send rejection reason to user
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    await creator.save();

    res.json({
      message: `Creator application ${action}d successfully`,
      creator: {
        id: creator._id,
        displayName: creator.displayName,
        verificationStatus: creator.verificationStatus,
        isVerified: creator.isVerified
      }
    });
  } catch (error) {
    console.error('Error reviewing creator application:', error);
    res.status(500).json({ error: 'Failed to review creator application' });
  }
};

module.exports = {
  applyForCreator,
  getCreatorProfile,
  updateCreatorProfile,
  getPublicCreatorProfile,
  toggleFollow,
  getSuggestedCreators,
  getPendingApplications,
  reviewCreatorApplication
};