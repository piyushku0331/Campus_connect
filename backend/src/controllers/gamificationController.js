const User = require('../models/User');

const getUserPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('points level');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ points: user.points, level: Math.floor(user.points / 100) + 1 });
  } catch (error) {
    console.error('Error fetching user points:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const PointTransaction = require('../models/PointTransaction');

const getPointsHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      PointTransaction.find({ user_id: userId })
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      PointTransaction.countDocuments({ user_id: userId })
    ]);

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching points history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const awardPoints = async (userId, points, reason, referenceId = null) => {
  try {
    console.log(`Awarding ${points} points to user ${userId} for reason: ${reason}`);

    const transaction = new PointTransaction({
      user_id: userId,
      points,
      transaction_type: 'earned',
      reason,
      reference_id: referenceId
    });
    await transaction.save();
    console.log('PointTransaction saved successfully');

    const user = await User.findById(userId);
    if (!user) {
      console.error('User not found for awarding points');
      return false;
    }

    const oldPoints = user.points || 0;
    user.points = oldPoints + points;
    await user.save();
    console.log(`User points updated from ${oldPoints} to ${user.points}`);

    return true;
  } catch (error) {
    console.error('Error awarding points:', error);
    return false;
  }
};
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const leaderboard = await User.find({})
      .select('name avatar_url profilePicture points')
      .sort({ points: -1 })
      .limit(parseInt(limit));

    const formattedLeaderboard = leaderboard.map((user, index) => ({
      id: user._id,
      name: user.name,
      avatar_url: user.avatar_url || user.profilePicture,
      points: user.points,
      rank: index + 1
    }));

    res.json(formattedLeaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getUserRank = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('points');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const usersWithHigherPoints = await User.countDocuments({
      points: { $gt: user.points }
    });

    res.json({ rank: usersWithHigherPoints + 1 });
  } catch (error) {
    console.error('Error fetching user rank:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const UserAchievement = require('../models/UserAchievement');

const getUserAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const achievements = await UserAchievement.find({ user_id: userId })
      .populate('achievement_id')
      .sort({ unlocked_at: -1 });

    const formattedAchievements = achievements.map(ua => ({
      id: ua._id,
      unlocked_at: ua.unlocked_at,
      achievement: {
        id: ua.achievement_id._id,
        name: ua.achievement_id.name,
        description: ua.achievement_id.description,
        icon_url: ua.achievement_id.icon_url,
        category: ua.achievement_id.category,
        points_required: ua.achievement_id.points_required
      }
    }));

    res.json(formattedAchievements);
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const Achievement = require('../models/Achievement');

const getAvailableAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ is_active: true })
      .sort({ points_required: 1 });
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const checkAchievements = async (userId) => {
  try {

    const [connectionsCount, eventsCreated, resourcesUploaded, eventsAttended] = await Promise.all([
      require('../models/Connection').countDocuments({
        $or: [{ sender_id: userId }, { receiver_id: userId }],
        status: 'accepted'
      }),
      require('../models/Event').countDocuments({ organizer_id: userId }),
      require('../models/Resource').countDocuments({ uploader_id: userId }),
      require('../models/EventAttendee').countDocuments({
        user_id: userId,
        status: 'attending'
      })
    ]);

    const userStats = {
      connections_count: connectionsCount,
      events_created: eventsCreated,
      resources_uploaded: resourcesUploaded,
      events_attended: eventsAttended
    };

    const achievements = await Achievement.find({ is_active: true });
    const unlockedAchievements = await UserAchievement.find({ user_id: userId }).select('achievement_id');
    const unlockedIds = unlockedAchievements.map(ua => ua.achievement_id.toString());

    for (const achievement of achievements) {
      if (unlockedIds.includes(achievement._id.toString())) continue;

      let shouldUnlock = false;
      switch (achievement.name) {
      case 'Social Butterfly':
        shouldUnlock = userStats.connections_count >= 10;
        break;
      case 'Event Organizer':
        shouldUnlock = userStats.events_created >= 5;
        break;
      case 'Knowledge Sharer':
        shouldUnlock = userStats.resources_uploaded >= 10;
        break;
      case 'Campus Explorer':
        shouldUnlock = userStats.events_attended >= 20;
        break;
      }

      if (shouldUnlock) {
        const userAchievement = new UserAchievement({
          user_id: userId,
          achievement_id: achievement._id
        });
        await userAchievement.save();
        await awardPoints(userId, achievement.points_required, `achievement_unlocked_${achievement.name}`);
      }
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
};
const Challenge = require('../models/Challenge');

const getActiveChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({
      is_active: true,
      end_date: { $gte: new Date() }
    }).sort({ created_at: -1 });

    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const UserChallenge = require('../models/UserChallenge');

const getUserChallenges = async (req, res) => {
  try {
    const userId = req.user.id;
    const challenges = await UserChallenge.find({ user_id: userId })
      .populate('challenge_id')
      .sort({ created_at: -1 });

    const formattedChallenges = challenges.map(uc => ({
      id: uc._id,
      status: uc.status,
      progress: uc.progress,
      completed_at: uc.completed_at,
      challenge: {
        id: uc.challenge_id._id,
        name: uc.challenge_id.name,
        description: uc.challenge_id.description,
        points_reward: uc.challenge_id.points_reward,
        category: uc.challenge_id.category,
        criteria: uc.challenge_id.criteria,
        end_date: uc.challenge_id.end_date
      }
    }));

    res.json(formattedChallenges);
  } catch (error) {
    console.error('Error fetching user challenges:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {
  getUserPoints,
  getPointsHistory,
  awardPoints,
  getLeaderboard,
  getUserRank,
  getUserAchievements,
  getAvailableAchievements,
  checkAchievements,
  getActiveChallenges,
  getUserChallenges
};
