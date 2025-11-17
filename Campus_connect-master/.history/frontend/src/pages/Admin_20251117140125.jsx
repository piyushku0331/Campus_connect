import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Users, BarChart3, Shield, Settings, TrendingUp, UserCheck, FileText, AlertTriangle, Calendar } from 'lucide-react';
import { AuroraBackground } from '../components/lightswind/aurora-background';
import GlowCard from '../components/ui/GlowCard';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [moderationContent, setModerationContent] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-textPrimary mb-2">Access Denied</h1>
          <p className="text-textMuted">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuroraBackground>
      <div className="min-h-screen relative">
        <div className="absolute inset-0 bg-dashboard-gradient"></div>
        <div className="relative z-10">
          <section className="py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
              >
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-accent-gradient">
                  Admin Panel
                </h1>
                <p className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto mb-8">
                  Manage users, moderate content, and view analytics for Campus Connect.
                </p>
              </motion.div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {[
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'users', label: 'User Management', icon: Users },
                  { id: 'events', label: 'Event Approval', icon: Calendar },
                  { id: 'alumni', label: 'Alumni Management', icon: UserCheck },
                  { id: 'moderation', label: 'Content Moderation', icon: Shield }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-card-gradient border border-borderMedium text-textPrimary hover:shadow-md'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Analytics Tab */}
              {activeTab === 'analytics' && analytics && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                >
                  <GlowCard>
                    <div className="text-center">
                      <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-textPrimary">{analytics.userMetrics.totalUsers}</div>
                      <p className="text-textMuted">Total Users</p>
                    </div>
                  </GlowCard>
                  <GlowCard>
                    <div className="text-center">
                      <UserCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-textPrimary">{analytics.userMetrics.activeUsers}</div>
                      <p className="text-textMuted">Active Users</p>
                    </div>
                  </GlowCard>
                  <GlowCard>
                    <div className="text-center">
                      <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-textPrimary">{analytics.contentMetrics.totalPosts}</div>
                      <p className="text-textMuted">Total Posts</p>
                    </div>
                  </GlowCard>
                  <GlowCard>
                    <div className="text-center">
                      <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-textPrimary">{analytics.engagementMetrics.recentPosts}</div>
                      <p className="text-textMuted">Posts (30d)</p>
                    </div>
                  </GlowCard>
                </motion.div>
              )}

              {/* User Management Tab */}
              {activeTab === 'users' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {users.map((user) => (
                    <GlowCard key={user._id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={user.avatar_url || '/default-avatar.png'}
                            alt={user.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <h3 className="font-semibold text-textPrimary">{user.name}</h3>
                            <p className="text-textMuted">{user.email}</p>
                            <p className="text-sm text-textMuted">{user.department} - {user.semester}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user._id, e.target.value)}
                            className="px-3 py-1 rounded border border-borderMedium bg-surface text-textPrimary"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="faculty">Faculty</option>
                          </select>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </GlowCard>
                  ))}
                </motion.div>
              )}

              {/* Content Moderation Tab */}
              {activeTab === 'moderation' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {moderationContent.map((content) => (
                    <GlowCard key={`${content.contentType}-${content._id}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              content.contentType === 'post' ? 'bg-blue-500' : 'bg-green-500'
                            } text-white`}>
                              {content.contentType}
                            </span>
                            <span className="text-sm text-textMuted">
                              by {content.author?.name || 'Unknown'}
                            </span>
                          </div>
                          <h3 className="font-semibold text-textPrimary mb-2">
                            {content.title || content.content?.substring(0, 100) + '...'}
                          </h3>
                          <p className="text-textMuted text-sm">
                            {new Date(content.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => moderateContent(content._id, content.contentType, 'approve')}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => moderateContent(content._id, content.contentType, 'reject')}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </GlowCard>
                  ))}
                  {moderationContent.length === 0 && (
                    <div className="text-center py-12">
                      <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-textPrimary mb-2">No content to moderate</h3>
                      <p className="text-textMuted">All content has been reviewed.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AuroraBackground>
  );
};

export default Admin;