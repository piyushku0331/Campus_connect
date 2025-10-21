import React, { useState } from 'react';
import { Trophy, Medal, Award, Star, TrendingUp, Users, BookOpen, Heart, MessageSquare } from 'lucide-react';
const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('overall');
  const leaderboardData = {
    overall: [
      {
        rank: 1,
        name: 'Rahul Kumar',
        avatar: 'RK',
        department: 'CSE',
        points: 2450,
        badges: ['Top Contributor', 'Lost Item Hero'],
        stats: { notes: 45, posts: 32, items: 8 },
        trend: 'up'
      },
      {
        rank: 2,
        name: 'Priya Sharma',
        avatar: 'PS',
        department: 'CSE',
        points: 2230,
        badges: ['Knowledge Sharer', 'Community Builder'],
        stats: { notes: 38, posts: 28, items: 5 },
        trend: 'up'
      },
      {
        rank: 3,
        name: 'Ankit Gupta',
        avatar: 'AG',
        department: 'ECE',
        points: 2100,
        badges: ['Top Contributor'],
        stats: { notes: 42, posts: 25, items: 3 },
        trend: 'down'
      },
      {
        rank: 4,
        name: 'Sneha Patel',
        avatar: 'SP',
        department: 'CSE',
        points: 1950,
        badges: ['Community Builder'],
        stats: { notes: 35, posts: 30, items: 2 },
        trend: 'up'
      },
      {
        rank: 5,
        name: 'Vikram Singh',
        avatar: 'VS',
        department: 'ME',
        points: 1820,
        badges: ['Lost Item Hero'],
        stats: { notes: 28, posts: 22, items: 6 },
        trend: 'same'
      }
    ],
    notes: [
      { rank: 1, name: 'Rahul Kumar', avatar: 'RK', department: 'CSE', points: 450, badges: ['Top Contributor'] },
      { rank: 2, name: 'Ankit Gupta', avatar: 'AG', department: 'ECE', points: 420, badges: ['Knowledge Sharer'] },
      { rank: 3, name: 'Priya Sharma', avatar: 'PS', department: 'CSE', points: 380, badges: [] },
      { rank: 4, name: 'Sneha Patel', avatar: 'SP', department: 'CSE', points: 350, badges: [] },
      { rank: 5, name: 'Arjun Mehta', avatar: 'AM', department: 'CSE', points: 320, badges: [] }
    ],
    posts: [
      { rank: 1, name: 'Sneha Patel', avatar: 'SP', department: 'CSE', points: 300, badges: ['Community Builder'] },
      { rank: 2, name: 'Priya Sharma', avatar: 'PS', department: 'CSE', points: 280, badges: [] },
      { rank: 3, name: 'Rahul Kumar', avatar: 'RK', department: 'CSE', points: 250, badges: [] },
      { rank: 4, name: 'Karan Jain', avatar: 'KJ', department: 'ECE', points: 220, badges: [] },
      { rank: 5, name: 'Meera Reddy', avatar: 'MR', department: 'CSE', points: 200, badges: [] }
    ],
    lost_found: [
      { rank: 1, name: 'Rahul Kumar', avatar: 'RK', department: 'CSE', points: 80, badges: ['Lost Item Hero'] },
      { rank: 2, name: 'Vikram Singh', avatar: 'VS', department: 'ME', points: 60, badges: [] },
      { rank: 3, name: 'Priya Sharma', avatar: 'PS', department: 'CSE', points: 50, badges: [] },
      { rank: 4, name: 'Ankit Gupta', avatar: 'AG', department: 'ECE', points: 30, badges: [] },
      { rank: 5, name: 'Sneha Patel', avatar: 'SP', department: 'CSE', points: 25, badges: [] }
    ]
  };
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="text-yellow-500" size={24} />;
      case 2: return <Medal className="text-gray-400" size={24} />;
      case 3: return <Award className="text-amber-600" size={24} />;
      default: return <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
    }
  };
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="text-green-500" size={16} />;
      case 'down': return <TrendingUp className="text-red-500 rotate-180" size={16} />;
      default: return <div className="w-4 h-0.5 bg-gray-400"></div>;
    }
  };
  const tabs = [
    { id: 'overall', label: 'Overall', icon: Trophy },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'posts', label: 'Posts', icon: MessageSquare },
    { id: 'lost_found', label: 'Lost & Found', icon: Heart }
  ];
  return (
    <div className="max-w-6xl mx-auto p-6">
      {}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Leaderboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Celebrating our most active and helpful community members</p>
      </div>
      {}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg">
          <Users className="mx-auto text-primary mb-2" size={24} />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">1,247</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg">
          <BookOpen className="mx-auto text-secondary mb-2" size={24} />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">342</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Notes Shared</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg">
          <MessageSquare className="mx-auto text-green-500 mb-2" size={24} />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">1,856</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Posts Created</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-lg">
          <Heart className="mx-auto text-red-500 mb-2" size={24} />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">89</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Items Returned</div>
        </div>
      </div>
      {}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        {}
        <div className="p-6">
          {activeTab === 'overall' ? (
            <div className="space-y-4">
              {}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {leaderboardData.overall.slice(0, 3).map((user, index) => (
                  <div key={user.rank} className={`text-center p-6 rounded-2xl ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                    'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
                  }`}>
                    <div className="text-4xl mb-2">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2">
                      {user.avatar}
                    </div>
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-sm opacity-90">{user.department}</p>
                    <div className="text-2xl font-bold mt-2">{user.points} pts</div>
                  </div>
                ))}
              </div>
              {}
              <div className="space-y-3">
                {leaderboardData.overall.map((user) => (
                  <div key={user.rank} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="flex items-center gap-3 w-16">
                      {getRankIcon(user.rank)}
                      {getTrendIcon(user.trend)}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{user.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.department}</p>
                      <div className="flex gap-1 mt-1">
                        {user.badges.map((badge, index) => (
                          <span key={index} className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">{user.points}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboardData[activeTab].map((user) => (
                <div key={user.rank} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-8 text-center">
                    {getRankIcon(user.rank)}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{user.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.department}</p>
                    <div className="flex gap-1 mt-1">
                      {user.badges.map((badge, index) => (
                        <span key={index} className="px-2 py-0.5 bg-primary/20 text-primary rounded-full text-xs">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">{user.points}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {activeTab === 'notes' ? 'notes shared' :
                       activeTab === 'posts' ? 'posts created' :
                       'items helped'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Achievement Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <Star className="text-yellow-500" size={20} />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Top Contributor</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">20+ notes shared</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="text-blue-500" size={20} />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Community Builder</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">50+ posts created</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Heart className="text-red-500" size={20} />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Lost Item Hero</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">5+ items returned</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="text-green-500" size={20} />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Knowledge Sharer</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">100+ likes on notes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Leaderboard;
