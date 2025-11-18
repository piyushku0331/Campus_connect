import React, { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
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
        return <AnalyticsDashboard />;
      case 'events':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white font-heading mb-6">Events Management</h2>
            <div className="space-y-8">
              <EventPostingForm />
              <EventManagement />
            </div>
          </div>
        );
      case 'notices':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white font-heading mb-6">Notice Upload</h2>
            <NoticeUploadForm />
          </div>
        );
      case 'posts':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white font-heading mb-6">Posts Management</h2>
            <PostManagement />
          </div>
        );
      case 'users':
        return (
          <div>
            <h2 className="text-2xl font-bold text-white font-heading mb-6">Users Management</h2>
            <UserManagement />
          </div>
        );
      default:
        return (
          <div>
            <div className="text-center text-gray-400">Select a section from the sidebar</div>
          </div>
        );
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminDashboardPage;