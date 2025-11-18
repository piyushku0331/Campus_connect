import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, Bell, User, Menu, LogOut, Settings } from 'lucide-react';
import VisionButton from '../ui/VisionButton';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ onMenuClick, isMobile }) => {
  const { signOut } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsNotificationsOpen(false);
    setIsProfileOpen(false);
  };

  const handleNotificationsClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsSearchOpen(false);
    setIsProfileOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsSearchOpen(false);
    setIsNotificationsOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="h-16 bg-linear-to-r from-[#0A0F2C]/90 via-[#111C44]/80 to-[#1A2759]/70 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 sm:px-6 relative overflow-hidden">
      {/* Glowing background illustration */}
      <div className="absolute inset-0 bg-linear-to-r from-[#2F4FFF]/10 via-[#0CEBFF]/5 to-[#2F4FFF]/10 animate-pulse"></div>
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#2F4FFF]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-[#0CEBFF]/15 rounded-full blur-2xl animate-pulse"></div>

      {/* Menu Button for Mobile */}
      {isMobile && (
        <div className="relative z-10">
          <VisionButton variant="ghost" size="sm" className="p-2" onClick={onMenuClick} aria-label="Toggle menu">
            <Menu className="w-5 h-5" />
          </VisionButton>
        </div>
      )}

      {/* Welcome Card */}
      <div className="relative z-10 flex items-center">
        <div className="bg-linear-to-br from-[#0A0F2C]/80 via-[#111C44]/60 to-[#1A2759]/40 backdrop-blur-md border border-white/10 rounded-xl px-3 sm:px-4 py-2 shadow-lg hover:shadow-[#2F4FFF]/20 transition-shadow duration-300">
          <p className="text-white font-medium text-xs sm:text-sm">
            Welcome back, <span className="text-[#0CEBFF] font-semibold">Admin</span>
          </p>
        </div>
      </div>

      {/* Right-side Icons */}
      <div className="relative z-10 flex items-center space-x-2 sm:space-x-4">
        {/* Search */}
        <div className="relative" ref={searchRef}>
          <VisionButton variant="ghost" size="sm" className="p-2" onClick={handleSearchClick} aria-label="Search">
            <Search className="w-5 h-5" />
          </VisionButton>
          {isSearchOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#0A0F2C]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-4">
              <input
                type="text"
                placeholder="Search users, posts, events..."
                className="w-full px-3 py-2 bg-[#111C44]/50 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#0CEBFF] focus:ring-1 focus:ring-[#0CEBFF]"
              />
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <VisionButton variant="ghost" size="sm" className="p-2 relative" onClick={handleNotificationsClick} aria-label="Notifications">
            <Bell className="w-5 h-5" />
            {/* Notification dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#0CEBFF] rounded-full" aria-hidden="true"></span>
          </VisionButton>
          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#0A0F2C]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl max-h-96 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-white font-semibold mb-3">Notifications</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-[#111C44]/50 rounded-lg border border-white/10">
                    <p className="text-white text-sm">New user registration: John Doe</p>
                    <p className="text-white/60 text-xs mt-1">2 minutes ago</p>
                  </div>
                  <div className="p-3 bg-[#111C44]/50 rounded-lg border border-white/10">
                    <p className="text-white text-sm">Event &#34;Tech Conference&#34; approved</p>
                    <p className="text-white/60 text-xs mt-1">1 hour ago</p>
                  </div>
                  <div className="p-3 bg-[#111C44]/50 rounded-lg border border-white/10">
                    <p className="text-white text-sm">System maintenance scheduled</p>
                    <p className="text-white/60 text-xs mt-1">3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <VisionButton variant="ghost" size="sm" className="p-2" onClick={handleProfileClick} aria-label="User profile">
            <User className="w-5 h-5" />
          </VisionButton>
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0A0F2C]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl">
              <div className="p-2">
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-white hover:bg-[#111C44]/50 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-white hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  onMenuClick: PropTypes.func,
  isMobile: PropTypes.bool,
};

export default Header;