import React from 'react';
import PropTypes from 'prop-types';
import { Home, BookOpen, Search, Users, Phone, Calendar, Trophy, MessageCircle, User, Moon, Sun } from 'lucide-react';
const Sidebar = ({ activeTab, setActiveTab, darkMode, toggleDarkMode, user, onLogout }) => {
  Sidebar.propTypes = {
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    darkMode: PropTypes.bool.isRequired,
    toggleDarkMode: PropTypes.func.isRequired,
    user: PropTypes.shape({
      profile: PropTypes.shape({
        name: PropTypes.string,
        department: PropTypes.string,
      }),
      email: PropTypes.string,
    }),
    onLogout: PropTypes.func.isRequired,
  };
  const menuItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'lost_found', label: 'Lost & Found', icon: Search },
    { id: 'alumni', label: 'Alumni', icon: Users },
    { id: 'contacts', label: 'Contacts', icon: Phone },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];
  return (
    <div className="w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-xl h-screen fixed left-0 top-0 p-6 border-r border-gray-200/50 dark:border-gray-700/50 animate-slide-in-left">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">Campus Connect</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Chitkara University</p>
          </div>
        </div>
        {user && (
          <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user.profile?.name?.split(' ').map(n => n[0]).join('') || user.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.profile?.name || 'User'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {user.profile?.department || 'Student'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <nav className="space-y-1 custom-scrollbar overflow-y-auto max-h-96">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group animate-fade-in ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 scale-105'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-102'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`p-1 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-white/20'
                  : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/10'
              }`}>
                <Icon size={18} className={isActive ? 'text-white' : 'text-primary'} />
              </div>
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>
      <div className="absolute bottom-6 left-6 right-6 animate-fade-in" style={{ animationDelay: '1s' }}>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Online</span>
          </div>
        </div>
        <div className="space-y-2">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 group"
          >
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/10 transition-colors">
              {darkMode ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-blue-500" />}
            </div>
            <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 hover:scale-105 group"
          >
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 group-hover:bg-red-200 dark:group-hover:bg-red-900/40 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default Sidebar;
