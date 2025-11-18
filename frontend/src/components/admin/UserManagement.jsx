import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaCalendarAlt, FaUserShield } from 'react-icons/fa';
import { usersAPI } from '../../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getUsers();
      setUsers(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <h2>Manage Users</h2>
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <h2>Manage Users</h2>
      <div className="user-management">
        {users.length === 0 ? (
          <div className="no-users">
            <p>No users found</p>
          </div>
        ) : (
          <div className="users-list">
            {users.map((user) => (
              <div key={user._id} className="user-item card">
                <div className="user-header">
                  <div className="user-avatar">
                    <FaUser />
                  </div>
                  <div className="user-info">
                    <h3>{user.name}</h3>
                    <div className="user-meta">
                      <span className="meta-item">
                        <FaEnvelope className="meta-icon" />
                        {user.email}
                      </span>
                      <span className="meta-item">
                        <FaCalendarAlt className="meta-icon" />
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                      <span className="meta-item">
                        <FaUserShield className="meta-icon" />
                        {user.role || 'Student'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="user-actions">
                  <button className="btn btn-secondary btn-sm">
                    View Profile
                  </button>
                  <button className="btn btn-warning btn-sm">
                    Edit User
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;