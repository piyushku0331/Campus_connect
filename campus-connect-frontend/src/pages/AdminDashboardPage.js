import React from 'react';
import '../assets/styles/pages/AdminDashboardPage.css';
import EventPostingForm from '../components/admin/EventPostingForm';
import NoticeUploadForm from '../components/admin/NoticeUploadForm';
import EventManagement from '../components/admin/EventManagement';
import PostManagement from '../components/admin/PostManagement';
import UserManagement from '../components/admin/UserManagement';

const AdminDashboardPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage campus events, notices, users, and community content</p>
      </div>
      <div className="admin-dashboard-grid">
        <EventPostingForm />
        <NoticeUploadForm />
        <EventManagement />
        <PostManagement />
        <UserManagement />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
