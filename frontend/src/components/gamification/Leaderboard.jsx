import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import api from '../../services/api';
const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchLeaderboard();
  }, []);
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/gamification/leaderboard');
      setLeaderboard(response.data);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };
  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-mid';
    }
  };
  if (loading) {
    return (
      <div className="bg-surface rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 mt-1"></div>
                </div>
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
            onClick={fetchLeaderboard}
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
        <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
      </div>
      {leaderboard.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No users on the leaderboard yet.</p>
          <p className="text-sm">Start earning points to appear here!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((user) => (
            <div
              key={user.id}
              className={`flex items-center p-4 rounded-lg ${getRankStyle(user.rank)} transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-center justify-center w-12 h-12 mr-4">
                {getRankIcon(user.rank)}
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <img
                    src={user.avatar_url || '/default-avatar.png'}
                    alt={user.full_name}
                    className="w-10 h-10 rounded-full mr-3 border-2 border-white"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{user.full_name}</h3>
                    <p className="text-sm text-gray-600">Level {user.level}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{user.points}</div>
                <div className="text-sm text-gray-600">points</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Earn points by creating events, making connections, and sharing resources!
        </p>
      </div>
    </div>
  );
};
export default Leaderboard;
