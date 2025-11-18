import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIsMobile } from '../../hooks/use-mobile';
import EnhancedSidebar from './EnhancedSidebar';
import Header from './Header';
const AdminLayout = ({ children, activeTab: propActiveTab, setActiveTab: propSetActiveTab }) => {
  const [internalActiveTab, setInternalActiveTab] = useState('dashboard');
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const activeTab = propActiveTab !== undefined ? propActiveTab : internalActiveTab;
  const setActiveTab = propSetActiveTab || setInternalActiveTab;

  const handleMenuClick = () => {
    if (isMobile) {
      setIsDrawerOpen(!isDrawerOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen relative overflow-hidden">
      <div className="fixed top-0 z-50 w-full">
        <Header onMenuClick={handleMenuClick} isMobile={isMobile} />
      </div>
      {!isMobile && (
        <div className="fixed left-0 top-16 h-[calc(100vh-8rem)] z-40">
          <EnhancedSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        {isMobile && isDrawerOpen && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsDrawerOpen(false)}
            />
            <div className="relative">
              <EnhancedSidebar
                activeTab={activeTab}
                setActiveTab={handleTabChange}
                isCollapsed={false}
                setIsCollapsed={() => {}}
                isDrawer={true}
              />
            </div>
          </div>
        )}
        <div className={`flex-1 overflow-auto scrollbar-hide p-4 sm:p-6 lg:p-8 pt-16 transition-all duration-300 ${!isMobile ? (isCollapsed ? 'ml-16' : 'ml-72') : ''}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
  activeTab: PropTypes.string,
  setActiveTab: PropTypes.func,
};

export default AdminLayout;