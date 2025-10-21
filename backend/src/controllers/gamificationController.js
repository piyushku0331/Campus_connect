const { supabase } = require('../config');
const getUserPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: user, error } = await supabase
      .from('users')
      .select('points, level')
      .eq('id', userId)
      .single();
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch user points' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user points:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getPointsHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const { data: transactions, error, count } = await supabase
      .from('points_transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch points history' });
    }
    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching points history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const awardPoints = async (userId, points, reason, referenceId = null) => {
  try {
    const { data: transaction, error: transactionError } = await supabase
      .from('points_transactions')
      .insert({
        user_id: userId,
        points,
        transaction_type: 'earned',
        reason,
        reference_id: referenceId
      })
      .select()
      .single();
    if (transactionError) {
      console.error('Error creating points transaction:', transactionError);
      return false;
    }
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();
    if (userError) {
      console.error('Error fetching user points:', userError);
      return false;
    }
    const newPoints = (user.points || 0) + points;
    const newLevel = Math.floor(newPoints / 100) + 1; 
    const { error: updateError } = await supabase
      .from('users')
      .update({
        points: newPoints,
        level: newLevel
      })
      .eq('id', userId);
    if (updateError) {
      console.error('Error updating user points:', updateError);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error awarding points:', error);
    return false;
  }
};
const getLeaderboard = async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const { data: leaderboard, error } = await supabase
      .from('leaderboards')
      .select('*')
      .limit(limit);
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getUserRank = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: rank, error } = await supabase
      .rpc('get_user_rank', { user_id: userId });
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch user rank' });
    }
    res.json({ rank: rank || 0 });
  } catch (error) {
    console.error('Error fetching user rank:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getUserAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: achievements, error } = await supabase
      .from('user_achievements')
      .select(`
        id,
        unlocked_at,
        achievements (
          id,
          name,
          description,
          icon_url,
          category,
          points_required
        )
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch user achievements' });
    }
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getAvailableAchievements = async (req, res) => {
  try {
    const { data: achievements, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true)
      .order('points_required', { ascending: true });
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch achievements' });
    }
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const checkAchievements = async (userId) => {
  try {
    const { data: userStats, error: statsError } = await supabase
      .rpc('get_user_stats', { user_id: userId });
    if (statsError) {
      console.error('Error fetching user stats:', statsError);
      return;
    }
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .eq('is_active', true);
    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError);
      return;
    }
    const { data: unlockedAchievements, error: unlockedError } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);
    if (unlockedError) {
      console.error('Error fetching unlocked achievements:', unlockedError);
      return;
    }
    const unlockedIds = unlockedAchievements.map(ua => ua.achievement_id);
    for (const achievement of achievements) {
      if (unlockedIds.includes(achievement.id)) continue;
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
        await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id
          });
        await awardPoints(userId, achievement.points_required, `achievement_unlocked_${achievement.name}`);
      }
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
  }
};
const getActiveChallenges = async (req, res) => {
  try {
    const { data: challenges, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('is_active', true)
      .gte('end_date', new Date().toISOString())
      .order('created_at', { ascending: false });
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch challenges' });
    }
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getUserChallenges = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: challenges, error } = await supabase
      .from('user_challenges')
      .select(`
        id,
        status,
        progress,
        completed_at,
        challenges (
          id,
          name,
          description,
          points_reward,
          category,
          criteria,
          end_date
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch user challenges' });
    }
    res.json(challenges);
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
