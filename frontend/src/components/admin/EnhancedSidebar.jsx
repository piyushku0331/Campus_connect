import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Gauge, Calendar, FileText, Users, Megaphone, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VisionButton from '../ui/VisionButton';

const EnhancedSidebar = ({
  activeTab,
  setActiveTab,
  isCollapsed: propIsCollapsed,
  setIsCollapsed: propSetIsCollapsed,
  isDrawer = false
}) => {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const isCollapsed = propIsCollapsed !== undefined ? propIsCollapsed : internalIsCollapsed;
  const setIsCollapsed = propSetIsCollapsed || setInternalIsCollapsed;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Gauge },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'notices', label: 'Notices', icon: FileText },
    { id: 'posts', label: 'Posts', icon: Megaphone },
    { id: 'users', label: 'Users', icon: Users },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    navigate('/login');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.div
      layout
      className={`relative h-full bg-linear-to-b from-[#0A0F2C] to-[#111C44] backdrop-blur-md bg-opacity-90 ${isDrawer ? 'w-72 border-r-0' : 'border-r border-[#1A2759] rounded-tr-2xl rounded-br-2xl'} shadow-2xl`}
      style={{
        background: 'linear-gradient(180deg, #0A0F2C 0%, #111C44 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      animate={isDrawer ? { x: 0 } : { width: isCollapsed ? 64 : 288 }}
      initial={isDrawer ? { x: -288 } : {}}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Header */}
      <div className={`${isCollapsed ? 'p-3' : 'p-6'} border-b border-[#1A2759] flex items-center justify-between transition-all duration-300`}>
        {!isCollapsed && (
          <h2 className="text-xl font-bold text-white drop-shadow-lg">
            Admin Panel
          </h2>
        )}
        <button
          onClick={toggleCollapse}
          className="p-2 rounded-lg bg-[#1A2759] hover:bg-[#2F4FFF] transition-colors duration-200 text-white"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 ${isCollapsed ? 'p-2 space-y-1' : 'p-4 space-y-2'} transition-all duration-300`} role="navigation" aria-label="Admin navigation">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <motion.div key={item.id} whileHover={{ scale: 1.02, x: 2 }} transition={{ duration: 0.2 }}>
              <VisionButton
                variant={isActive ? "primary" : "ghost"}
                size="sm"
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? 'shadow-[0_4px_20px_rgba(47,79,255,0.4)] border border-[#0CEBFF]/50'
                    : 'text-gray-300 hover:text-white hover:shadow-[0_2px_10px_rgba(12,235,255,0.2)]'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
                onClick={() => setActiveTab(item.id)}
                aria-label={`Navigate to ${item.label}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive ? 'drop-shadow-[0_0_8px_#0CEBFF]' : 'drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]'
                  }`}
                />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </VisionButton>
              {!isCollapsed && index < menuItems.length - 1 && (
                <div className="h-px bg-[#1A2759] mx-4 my-2"></div>
              )}
            </motion.div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-[#1A2759] transition-all duration-300`}>
        <VisionButton
          variant="ghost"
          size="sm"
          className={`w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white transition-all duration-300 ${
            isCollapsed ? 'justify-center px-2' : ''
          }`}
          onClick={handleLogout}
          aria-label="Logout"
        >
          <LogOut
            className="w-5 h-5 drop-shadow-[0_0_4px_rgba(255,255,255,0.3)]"
          />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </VisionButton>
      </div>
    </motion.div>
  );
};

EnhancedSidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  isCollapsed: PropTypes.bool,
  setIsCollapsed: PropTypes.func,
  isDrawer: PropTypes.bool,
};

export default EnhancedSidebar;