import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTachometerAlt, FaCalendarAlt, FaFileAlt, FaUsers, FaBullhorn, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { id: 'events', label: 'Events', icon: FaCalendarAlt },
    { id: 'notices', label: 'Notices', icon: FaFileAlt },
    { id: 'posts', label: 'Posts', icon: FaBullhorn },
    { id: 'users', label: 'Users', icon: FaUsers },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>Admin Panel</h2>
        </div>
        <nav className="admin-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="admin-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
      <div className="admin-content">
        {React.cloneElement(children, { activeTab, setActiveTab })}
      </div>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;