import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TrendingUp, Target, Award, Star } from 'lucide-react';
import api from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
const UserProgress = ({ userId }) => {
  const [userPoints, setUserPoints] = useState(null);
  UserProgress.propTypes = {
   userId: PropTypes.string.isRequired,
  };
  const [pointsHistory, setPointsHistory] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { onDashboardUpdate } = useSocket();
  useEffect(() => {
    fetchUserProgress();
  }, [userId]);

  // Listen for real-time points updates
  useEffect(() => {
    const unsubscribe = onDashboardUpdate((data) => {
      if (data.type === 'points_update') {
        // Update points and refetch rank
        setUserPoints(prev => prev ? { ...prev, points: data.points } : null);
        // Refetch rank as it might have changed
        api.get('/gamification/rank').then(res => setUserRank(res.data)).catch(console.error);
      }
    });
    return unsubscribe;
  }, [onDashboardUpdate]);
  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      const [pointsRes, historyRes, rankRes] = await Promise.all([
        api.get('/gamification/points'),
        api.get('/gamification/points/history?page=1&limit=5'),
        api.get('/gamification/rank')
      ]);
      setUserPoints(pointsRes.data);
      setPointsHistory(historyRes.data.transactions);
      setUserRank(rankRes.data);
    } catch (err) {
      setError('Failed to load progress data');
      console.error('Error fetching user progress:', err);
    } finally {
      setLoading(false);
    }
  };
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'earned':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'bonus':
        return <Star className="w-4 h-4 text-yellow-500" />;
      default:
        return <Target className="w-4 h-4 text-blue-500" />;
    }
  };
  const getTransactionColor = (type) => {
    switch (type) {
      case 'earned':
        return 'text-green-600';
      case 'bonus':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };
  const getNextLevelProgress = () => {
    if (!userPoints) return 0;
    const currentLevelPoints = (userPoints.level - 1) * 100;
    const nextLevelPoints = userPoints.level * 100;
    const progress = ((userPoints.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(progress, 100);
  };
  const getPointsToNextLevel = () => {
    if (!userPoints) return 0;
    return (userPoints.level * 100) - userPoints.points;
  };
  if (loading) {
    return (
      <div className="bg-surface rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
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
            onClick={fetchUserProgress}
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
        <TrendingUp className="w-6 h-6 text-blue-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Your Progress</h2>
      </div>
      {}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Current Level</span>
          <span className="text-lg font-bold text-blue-600">Level {userPoints?.level || 1}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${getNextLevelProgress()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{userPoints?.points || 0} points</span>
          <span>{getPointsToNextLevel()} to next level</span>
        </div>
      </div>
      {}
      {userRank && (
        <div className="mb-6 p-4 bg-linear-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className="w-5 h-5 text-purple-500 mr-2" />
              <span className="font-medium text-gray-700">Your Rank</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">#{userRank.rank}</div>
              <div className="text-sm text-gray-600">out of all users</div>
            </div>
          </div>
        </div>
      )}
      {}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Recent Activity</h3>
        {pointsHistory.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No recent activity</p>
            <p className="text-xs">Start earning points to see your activity here!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pointsHistory.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-mid transition-colors"
              >
                <div className="flex items-center">
                  {getTransactionIcon(transaction.transaction_type)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800 capitalize">
                      {transaction.reason?.replace(/_/g, ' ') || 'Points earned'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${getTransactionColor(transaction.transaction_type)}`}>
                  +{transaction.points} pts
                </div>
              </div>
            ))}
          </div>
        )}
        {pointsHistory.length >= 5 && (
          <div className="text-center mt-4">
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View all activity →
            </button>
          </div>
        )}
      </div>
      {}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{userPoints?.points || 0}</div>
          <div className="text-xs text-gray-600">Total Points</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">{userRank?.rank || 'N/A'}</div>
          <div className="text-xs text-gray-600">Global Rank</div>
        </div>
      </div>
    </div>
  );
};
export default UserProgress;
