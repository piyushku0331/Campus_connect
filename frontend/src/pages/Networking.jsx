import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MessageCircle, Check, X, Users as UsersIcon, Star, Search, UserPlus } from 'lucide-react';
import { connectionsAPI, usersAPI } from '../services/api';
const Networking = () => {
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    fetchConnections();
    fetchRequests();
  }, []);
  const fetchConnections = async () => {
    try {
      const response = await connectionsAPI.getConnections();
      setConnections(response.data || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };
  const fetchRequests = async () => {
    try {
      const response = await connectionsAPI.getConnectionRequests();
      setRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching connection requests:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleAcceptRequest = async (requestId) => {
    try {
      await connectionsAPI.acceptConnectionRequest(requestId);
      fetchRequests();
      fetchConnections();
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };
  const handleRejectRequest = async (requestId) => {
    try {
      await connectionsAPI.rejectConnectionRequest(requestId);
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };
  const handleSendRequest = async (receiverId) => {
    try {
      await connectionsAPI.sendConnectionRequest(receiverId);
      setSearchResults([]);
      setSearchQuery('');
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };
  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await usersAPI.searchUsers(query);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };
  const handleRemoveConnection = async (connectionId) => {
    try {
      await connectionsAPI.removeConnection(connectionId);
      fetchConnections();
    } catch (error) {
      console.error('Error removing connection:', error);
    }
  };
  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
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
              Campus Network
            </h1>
            <p className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto mb-8">
              Connect with fellow students, share experiences, and build lasting relationships.
            </p>
            {}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="glass-card rounded-2xl px-6 py-3">
                <span className="text-textPrimary font-medium">156</span>
                <span className="text-textMuted ml-2">Total Students</span>
              </div>
              <div className="glass-card rounded-2xl px-6 py-3">
                <span className="text-textPrimary font-medium">42</span>
                <span className="text-textMuted ml-2">Active Connections</span>
              </div>
              <div className="glass-card rounded-2xl px-6 py-3">
                <span className="text-textPrimary font-medium">12</span>
                <span className="text-textMuted ml-2">Pending Requests</span>
              </div>
            </div>
            {}
            <div className="max-w-md mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textMuted w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for students..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-surface/80 backdrop-blur-xl border border-borderSubtle rounded-full text-textPrimary placeholder-textMuted focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              {}
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 w-full bg-surface/90 backdrop-blur-xl border border-borderSubtle rounded-2xl shadow-[0_0_25px_rgba(107,159,255,0.1)] max-h-64 overflow-y-auto z-10"
                >
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-borderSubtle last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent-gradient rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user.avatar_url || user.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-textPrimary font-medium">{user.full_name}</p>
                          <p className="text-textMuted text-sm">{user.major} - {user.year}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSendRequest(user.id)}
                        className="bg-accent-gradient text-white px-4 py-2 rounded-full font-medium hover:shadow-[0_0_20px_#6B9FFF]/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Connect
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-semibold text-textPrimary mb-8">Connection Requests</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-textMuted mt-4">Loading requests...</p>
              </div>
            ) : requests.length > 0 ? (
              <div className="space-y-6">
                {requests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-surface/80 backdrop-blur-xl border border-borderSubtle rounded-2xl p-6 shadow-[0_0_25px_rgba(107,159,255,0.1)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent-gradient rounded-full flex items-center justify-center text-white font-semibold">
                          {request.sender?.avatar_url || request.sender?.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-textPrimary">{request.sender?.full_name}</h3>
                          <p className="text-textMuted">{request.sender?.major} - {request.sender?.year}</p>
                          <p className="text-textMuted text-sm">Connection request</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-300 flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium transition-colors duration-300 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Decline
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <UsersIcon className="w-16 h-16 text-textMuted mx-auto mb-4" />
                <p className="text-textMuted text-lg">No pending connection requests.</p>
              </div>
            )}
          </motion.div>
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-semibold text-textPrimary mb-8">My Connections</h2>
            {connections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {connections.map((connection, index) => (
                  <motion.div
                    key={connection.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-surface/80 backdrop-blur-xl border border-borderSubtle rounded-2xl p-8 shadow-[0_0_25px_rgba(107,159,255,0.1)] hover:shadow-[0_0_30px_rgba(107,159,255,0.2)] transition-all duration-300"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-accent-gradient rounded-full flex items-center justify-center text-white font-semibold text-lg mx-auto mb-4">
                        {connection.user?.avatar_url || connection.user?.full_name?.charAt(0) || 'U'}
                      </div>
                      <h3 className="text-xl font-semibold text-textPrimary mb-1">{connection.user?.full_name}</h3>
                      <p className="text-textMuted text-sm mb-2">{connection.user?.major} - {connection.user?.year}</p>
                      <p className="text-textMuted text-xs">Connected</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-accent-gradient text-white font-medium py-3 px-6 rounded-full hover:shadow-[0_0_20px_#6B9FFF]/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </button>
                      <button
                        onClick={() => handleRemoveConnection(connection.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-full hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <UsersIcon className="w-16 h-16 text-textMuted mx-auto mb-4" />
                <p className="text-textMuted text-lg">No connections yet. Start connecting with fellow students!</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
      </div>
    </div>
  );
};
export default Networking;
