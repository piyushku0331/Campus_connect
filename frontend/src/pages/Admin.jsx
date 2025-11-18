import React, { useState } from 'react';
import { FaChartBar, FaUsers, FaCalendarAlt, FaUserGraduate, FaShieldAlt } from 'react-icons/fa';
import EventManagement from '../components/admin/EventManagement';
import UserManagement from '../components/admin/UserManagement';
import PostManagement from '../components/admin/PostManagement';
import EventPostingForm from '../components/admin/EventPostingForm';
import NoticeUploadForm from '../components/admin/NoticeUploadForm';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('analytics');

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: FaChartBar },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'events', label: 'Events', icon: FaCalendarAlt },
    { id: 'alumni', label: 'Alumni', icon: FaUserGraduate },
    { id: 'moderation', label: 'Moderation', icon: FaShieldAlt },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <div className="admin-tab-content">
            <h2>Analytics Dashboard</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Total Users</h3>
                <p className="metric">1,234</p>
              </div>
              <div className="analytics-card">
                <h3>Active Events</h3>
                <p className="metric">45</p>
              </div>
              <div className="analytics-card">
                <h3>Community Posts</h3>
                <p className="metric">892</p>
              </div>
              <div className="analytics-card">
                <h3>Uploaded Notices</h3>
                <p className="metric">67</p>
              </div>
            </div>
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'events':
        return (
          <div className="admin-tab-content">
            <EventPostingForm />
            <EventManagement />
          </div>
        );
      case 'alumni':
        return (
          <div className="admin-tab-content">
            <h2>Alumni Management</h2>
            <p>Alumni features coming soon...</p>
          </div>
        );
      case 'moderation':
        return (
          <div className="admin-tab-content">
            <h2>Content Moderation</h2>
            <PostManagement />
            <NoticeUploadForm />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Administration Panel</h1>
      </div>
      <div className="admin-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="tab-icon" />
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="admin-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Admin;