import React from 'react';
import '../assets/styles/pages/AdminDashboardPage.css';

// In a real app, these would be separate components with data tables and management logic.
const UserManagement = () => <div><h2>Manage Users</h2><p>User list and actions would appear here.</p></div>;
const EventManagement = () => <div><h2>Manage Events</h2><p>Event list (pending and approved) would appear here.</p></div>;
const NoticeManagement = () => <div><h2>Manage Notices</h2><p>Notice list and upload forms would appear here.</p></div>;
const PostManagement = () => <div><h2>Manage Community Posts</h2><p>Post feed with delete options would appear here.</p></div>;

const AdminDashboardPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
      </div>
      <div className="admin-dashboard-grid">
        <div className="admin-panel"><UserManagement /></div>
        <div className="admin-panel"><EventManagement /></div>
        <div className="admin-panel"><NoticeManagement /></div>
        <div className="admin-panel"><PostManagement /></div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
