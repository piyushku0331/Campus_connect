import React, { useState, useEffect } from 'react';
import { Trophy, Award, TrendingUp, Star, Target } from 'lucide-react';
import api from '../../services/api';
const GamificationWidget = () => {
  const [userPoints, setUserPoints] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchGamificationData();
  }, []);
  const fetchGamificationData = async () => {
    try {
      setLoading(true);
      const [pointsRes, rankRes, achievementsRes] = await Promise.all([
        api.get('/gamification/points'),
        api.get('/gamification/rank'),
        api.get('/gamification/achievements')
      ]);
      setUserPoints(pointsRes.data);
      setUserRank(rankRes.data);
      setRecentAchievements(achievementsRes.data.slice(0, 3));
    } catch (err) {
      console.error('Error fetching gamification data:', err);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/20 rounded"></div>
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center">
          <Trophy className="w-5 h-5 mr-2" />
          Your Stats
        </h3>
        <Star className="w-5 h-5 text-yellow-300" />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {}
        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center mb-1">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Points</span>
          </div>
          <div className="text-2xl font-bold">{userPoints?.points || 0}</div>
          <div className="text-xs opacity-80">Level {userPoints?.level || 1}</div>
        </div>
        {}
        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center mb-1">
            <Target className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Rank</span>
          </div>
          <div className="text-2xl font-bold">#{userRank?.rank || 'N/A'}</div>
          <div className="text-xs opacity-80">Global</div>
        </div>
      </div>
      {}
      {recentAchievements.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center">
            <Award className="w-4 h-4 mr-1" />
            Recent Achievements
          </h4>
          <div className="space-y-2">
            {recentAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center bg-white/10 rounded-lg p-2 backdrop-blur-sm"
              >
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
                  <Award className="w-4 h-4 text-yellow-800" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {achievement.achievements?.name}
                  </div>
                  <div className="text-xs opacity-80">
                    {new Date(achievement.unlocked_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {}
      {userPoints && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress to Level {userPoints.level + 1}</span>
            <span>{((userPoints.level * 100) - userPoints.points)} pts left</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(((userPoints.points % 100) / 100) * 100, 100)}%`
              }}
            ></div>
          </div>
        </div>
      )}
      {}
      <div className="mt-4 text-center">
        <p className="text-xs opacity-80 mb-2">
          Keep earning points to unlock achievements!
        </p>
        <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors backdrop-blur-sm">
          View Full Stats →
        </button>
      </div>
    </div>
  );
};
export default GamificationWidget;
