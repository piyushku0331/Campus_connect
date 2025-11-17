import React, { useState, useEffect } from 'react';
import { Users, BarChart3, Shield, TrendingUp, UserCheck, FileText, AlertTriangle, Calendar, CheckCircle, XCircle, Trash2, UserPlus } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [moderationContent, setModerationContent] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle tab switching from sidebar clicks
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['analytics', 'users', 'events', 'alumni', 'moderation'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAnalytics();
      fetchUsers();
      fetchModerationContent();
      fetchPendingEvents();
      fetchAlumni();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchModerationContent = async () => {
    try {
      const response = await api.get('/admin/moderation');
      setModerationContent(response.data.content);
    } catch (error) {
      console.error('Error fetching moderation content:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const moderateContent = async (contentId, contentType, action) => {
    try {
      await api.post('/admin/moderation', { id: contentId, contentType, action });
      fetchModerationContent();
    } catch (error) {
      console.error('Error moderating content:', error);
    }
  };

  const fetchPendingEvents = async () => {
    try {
      const response = await api.get('/admin/events/pending');
      setPendingEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching pending events:', error);
    }
  };

  const fetchAlumni = async () => {
    try {
      const response = await api.get('/admin/alumni');
      setAlumni(response.data.alumni);
    } catch (error) {
      console.error('Error fetching alumni:', error);
    }
  };

  const approveEvent = async (eventId) => {
    try {
      await api.put(`/admin/events/${eventId}/approve`);
      fetchPendingEvents();
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  const rejectEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to reject and delete this event?')) {
      try {
        await api.delete(`/admin/events/${eventId}/reject`);
        fetchPendingEvents();
      } catch (error) {
        console.error('Error rejecting event:', error);
      }
    }
  };

  const addAlumni = async (userId) => {
    try {
      await api.post('/admin/alumni', { userId });
      fetchUsers();
      fetchAlumni();
    } catch (error) {
      console.error('Error adding alumni:', error);
    }
  };

  const removeAlumni = async (alumniId) => {
    try {
      await api.delete(`/admin/alumni/${alumniId}`);
      fetchUsers();
      fetchAlumni();
    } catch (error) {
      console.error('Error removing alumni:', error);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{analytics?.userMetrics?.totalUsers || 0}</div>
            <p className="text-gray-400">Total Users</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="text-center">
            <UserCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{analytics?.userMetrics?.activeUsers || 0}</div>
            <p className="text-gray-400">Active Users</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="text-center">
            <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{analytics?.contentMetrics?.totalPosts || 0}</div>
            <p className="text-gray-400">Total Posts</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{analytics?.engagementMetrics?.recentPosts || 0}</div>
            <p className="text-gray-400">Posts (30d)</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">User Management</h3>
        </div>
        <div className="divide-y divide-gray-700">
          {users.map((user) => (
            <div key={user._id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar_url || '/default-avatar.png'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-white">{user.name}</h4>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <p className="text-gray-500 text-xs">{user.department} - {user.semester}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={user.role}
                  onChange={(e) => updateUserRole(user._id, e.target.value)}
                  className="px-3 py-1 rounded bg-gray-700 border border-gray-600 text-white text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="faculty">Faculty</option>
                </select>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEventsTab = () => (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Pending Event Approvals</h3>
        </div>
        <div className="divide-y divide-gray-700">
          {pendingEvents.map((event) => (
            <div key={event._id} className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded text-xs bg-blue-600 text-white">Event</span>
                    <span className="text-sm text-gray-400">by {event.organizer_id?.name || 'Unknown'}</span>
                  </div>
                  <h4 className="font-medium text-white mb-2">{event.title}</h4>
                  <p className="text-gray-400 text-sm mb-2">{event.description}</p>
                  <div className="text-sm text-gray-500">
                    <p>Location: {event.location}</p>
                    <p>Start: {new Date(event.start_date).toLocaleString()}</p>
                    <p>Campus: {event.campus} | Category: {event.category}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => approveEvent(event._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectEvent(event._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {pendingEvents.length === 0 && (
          <div className="px-6 py-12 text-center">
            <Calendar className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-white mb-2">No pending events</h4>
            <p className="text-gray-400">All events have been reviewed.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAlumniTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="text-center">
            <UserCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{alumni.length}</div>
            <p className="text-gray-400">Total Alumni</p>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{users.filter(u => u.role === 'user').length}</div>
            <p className="text-gray-400">Available Users</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Current Alumni</h3>
        </div>
        <div className="divide-y divide-gray-700">
          {alumni.map((alum) => (
            <div key={alum._id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={alum.avatar_url || '/default-avatar.png'}
                  alt={alum.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-white">{alum.name}</h4>
                  <p className="text-gray-400 text-sm">{alum.email}</p>
                  <p className="text-gray-500 text-xs">{alum.department} - {alum.semester}</p>
                </div>
              </div>
              <button
                onClick={() => removeAlumni(alum._id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Add New Alumni</h3>
        </div>
        <div className="divide-y divide-gray-700">
          {users.filter(u => u.role === 'user').map((user) => (
            <div key={user._id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar_url || '/default-avatar.png'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-medium text-white">{user.name}</h4>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <p className="text-gray-500 text-xs">{user.department} - {user.semester}</p>
                </div>
              </div>
              <button
                onClick={() => addAlumni(user._id)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
              >
                Add to Alumni
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderModerationTab = () => (
    <div className="space-y-4">
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white">Content Moderation</h3>
        </div>
        <div className="divide-y divide-gray-700">
          {moderationContent.map((content) => (
            <div key={`${content.contentType}-${content._id}`} className="px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      content.contentType === 'post' ? 'bg-blue-600' : 'bg-green-600'
                    } text-white`}>
                      {content.contentType}
                    </span>
                    <span className="text-sm text-gray-400">by {content.author?.name || 'Unknown'}</span>
                  </div>
                  <h4 className="font-medium text-white mb-2">
                    {content.title || content.content?.substring(0, 100) + '...'}
                  </h4>
                  <p className="text-gray-500 text-sm">
                    {new Date(content.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => moderateContent(content._id, content.contentType, 'approve')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => moderateContent(content._id, content.contentType, 'reject')}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {moderationContent.length === 0 && (
          <div className="px-6 py-12 text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-white mb-2">No content to moderate</h4>
            <p className="text-gray-400">All content has been reviewed.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return renderAnalyticsTab();
      case 'users':
        return renderUsersTab();
      case 'events':
        return renderEventsTab();
      case 'alumni':
        return renderAlumniTab();
      case 'moderation':
        return renderModerationTab();
      default:
        return renderAnalyticsTab();
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage users, moderate content, and view analytics</p>
        </div>
        {renderContent()}
      </div>
    </AdminLayout>
  );
};

export default Admin;