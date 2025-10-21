import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Award, Star, Users, Calendar, BookOpen, Trophy } from 'lucide-react';
import api from '../../services/api';
const AchievementBadges = ({ userId }) => {
  const [achievements, setAchievements] = useState([]);
AchievementBadges.propTypes = {
  userId: PropTypes.string.isRequired,
};
  const [availableAchievements, setAvailableAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchAchievements();
  }, [userId]);
  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const [userAchievementsRes, availableRes] = await Promise.all([
        api.get('/gamification/achievements'),
        api.get('/gamification/achievements/available')
      ]);
      setAchievements(userAchievementsRes.data);
      setAvailableAchievements(availableRes.data);
    } catch (err) {
      setError('Failed to load achievements');
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  };
  const getAchievementIcon = (name) => {
    if (name.includes('Social') || name.includes('Connection')) {
      return <Users className="w-6 h-6" />;
    } else if (name.includes('Event') || name.includes('Organizer')) {
      return <Calendar className="w-6 h-6" />;
    } else if (name.includes('Resource') || name.includes('Knowledge')) {
      return <BookOpen className="w-6 h-6" />;
    } else if (name.includes('Campus') || name.includes('Explorer')) {
      return <Trophy className="w-6 h-6" />;
    }
    return <Award className="w-6 h-6" />;
  };
  const getCategoryColor = (category) => {
    switch (category) {
      case 'social':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'academic':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'engagement':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-mid text-textMuted border-borderSubtle';
    }
  };
  const unlockedAchievementIds = achievements.map(a => a.achievements?.id);
  if (loading) {
    return (
      <div className="bg-surface rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-surface rounded-lg shadow-md p-6">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={fetchAchievements}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-surface rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Award className="w-6 h-6 text-purple-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Achievements</h2>
      </div>
      {achievements.length === 0 && availableAchievements.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No achievements available yet.</p>
        </div>
      ) : (
        <>
          {}
          {achievements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                Unlocked ({achievements.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 border-2 border-yellow-200 bg-yellow-50 rounded-lg text-center hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      {getAchievementIcon(achievement.achievements?.name)}
                    </div>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {achievement.achievements?.name}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {achievement.achievements?.description}
                    </p>
                    <div className="mt-2">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(achievement.achievements?.category)}`}>
                        {achievement.achievements?.category}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Unlocked {new Date(achievement.unlocked_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {}
          {availableAchievements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                <Award className="w-5 h-5 text-gray-400 mr-2" />
                Available ({availableAchievements.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableAchievements.map((achievement) => {
                  const isUnlocked = unlockedAchievementIds.includes(achievement.id);
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 border-2 rounded-lg text-center transition-all ${
                        isUnlocked
                          ? 'border-yellow-200 bg-yellow-50 opacity-60'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                        isUnlocked ? 'bg-yellow-500' : 'bg-gray-300'
                      }`}>
                        {getAchievementIcon(achievement.name)}
                      </div>
                      <h4 className={`font-semibold text-sm ${
                        isUnlocked ? 'text-gray-800' : 'text-gray-500'
                      }`}>
                        {achievement.name}
                      </h4>
                      <p className={`text-xs mt-1 ${
                        isUnlocked ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(achievement.category)}`}>
                          {achievement.category}
                        </span>
                      </div>
                      {!isUnlocked && (
                        <div className="text-xs text-gray-400 mt-2">
                          {achievement.points_required} points required
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default AchievementBadges;
