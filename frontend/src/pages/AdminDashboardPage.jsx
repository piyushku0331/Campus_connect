import React, { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import EventPostingForm from '../components/admin/EventPostingForm';
import NoticeUploadForm from '../components/admin/NoticeUploadForm';
import EventManagement from '../components/admin/EventManagement';
import PostManagement from '../components/admin/PostManagement';
import UserManagement from '../components/admin/UserManagement';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveTab('events')}
                  >
                    Post Event
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setActiveTab('notices')}
                  >
                    Upload Notice
                  </button>
                </div>
              </div>
              <div className="dashboard-card">
                <h3>Management</h3>
                <div className="management-links">
                  <button
                    className="btn btn-outline"
                    onClick={() => setActiveTab('events')}
                  >
                    Manage Events
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => setActiveTab('posts')}
                  >
                    Manage Posts
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => setActiveTab('users')}
                  >
                    Manage Users
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'events':
        return (
          <div className="admin-section">
            <EventPostingForm />
            <EventManagement />
          </div>
        );
      case 'notices':
        return <NoticeUploadForm />;
      case 'posts':
        return <PostManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <AdminLayout>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminDashboardPage;