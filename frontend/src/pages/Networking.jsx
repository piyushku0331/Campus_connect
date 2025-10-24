import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, MessageCircle, Check, X, Users as UsersIcon, Star, Search, UserPlus } from 'lucide-react';
// import { connectionsAPI, usersAPI } from '../services/api'; // Commented out for mock functionality
const Networking = () => {
  const [connections, setConnections] = useState([
    {
      id: 1,
      user: {
        id: 2,
        full_name: "Priya Sharma",
        major: "Computer Science",
        year: "BE23",
        avatar_url: null
      },
      connected_at: "2024-01-15T10:00:00Z"
    },
    {
      id: 2,
      user: {
        id: 3,
        full_name: "Rahul Verma",
        major: "Information Technology",
        year: "BE22",
        avatar_url: null
      },
      connected_at: "2024-01-20T14:30:00Z"
    },
    {
      id: 3,
      user: {
        id: 4,
        full_name: "Ananya Patel",
        major: "Electronics",
        year: "BE23",
        avatar_url: null
      },
      connected_at: "2024-01-25T09:15:00Z"
    },
    {
      id: 4,
      user: {
        id: 5,
        full_name: "Vikram Singh",
        major: "Mechanical Engineering",
        year: "BE22",
        avatar_url: null
      },
      connected_at: "2024-02-01T16:45:00Z"
    },
    {
      id: 5,
      user: {
        id: 6,
        full_name: "Sneha Gupta",
        major: "Civil Engineering",
        year: "BE21",
        avatar_url: null
      },
      connected_at: "2024-02-05T11:20:00Z"
    },
    {
      id: 6,
      user: {
        id: 7,
        full_name: "Arjun Kumar",
        major: "Business Administration",
        year: "BE23",
        avatar_url: null
      },
      connected_at: "2024-02-10T13:10:00Z"
    }
  ]);
  const [requests, setRequests] = useState([
    {
      id: 1,
      sender: {
        id: 8,
        full_name: "Kavya Reddy",
        major: "Data Science",
        year: "BE22",
        avatar_url: null
      },
      sent_at: "2024-02-12T10:30:00Z"
    },
    {
      id: 2,
      sender: {
        id: 9,
        full_name: "Mohammed Ali",
        major: "Electrical Engineering",
        year: "BE21",
        avatar_url: null
      },
      sent_at: "2024-02-13T15:45:00Z"
    },
    {
      id: 3,
      sender: {
        id: 10,
        full_name: "Divya Jain",
        major: "Biotechnology",
        year: "BE23",
        avatar_url: null
      },
      sent_at: "2024-02-14T09:20:00Z"
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([
    {
      id: 11,
      full_name: "Rohan Mehta",
      major: "Chemical Engineering",
      year: "BE22",
      avatar_url: null
    },
    {
      id: 12,
      full_name: "Ishita Choudhary",
      major: "Psychology",
      year: "BE23",
      avatar_url: null
    },
    {
      id: 13,
      full_name: "Amitabh Singh",
      major: "Mathematics",
      year: "BE21",
      avatar_url: null
    },
    {
      id: 14,
      full_name: "Pooja Agarwal",
      major: "Economics",
      year: "BE22",
      avatar_url: null
    }
  ]);
  useEffect(() => {
    fetchConnections();
    fetchRequests();
  }, [fetchConnections, fetchRequests]);
  const fetchConnections = useCallback(async () => {
    try {
      // Using mock data instead of API call
      // const response = await connectionsAPI.getConnections();
      // setConnections(response.data || []);
      setConnections(connections); // Already have mock data
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  }, [connections]);

  const fetchRequests = useCallback(async () => {
    try {
      // Using mock data instead of API call
      // const response = await connectionsAPI.getConnectionRequests();
      // setRequests(response.data || []);
      setRequests(requests); // Already have mock data
    } catch (error) {
      console.error('Error fetching connection requests:', error);
    } finally {
      setLoading(false);
    }
  }, [requests]);
  const handleAcceptRequest = async (requestId) => {
    try {
      // Mock accept functionality
      const requestToAccept = requests.find(r => r.id === requestId);
      if (requestToAccept) {
        const newConnection = {
          id: connections.length + 1,
          user: requestToAccept.sender,
          connected_at: new Date().toISOString()
        };
        setConnections(prev => [...prev, newConnection]);
        setRequests(prev => prev.filter(r => r.id !== requestId));
      }
      alert('Connection request accepted! (Mock functionality)');
      // fetchRequests(); fetchConnections(); // Not needed with mock data
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };
  const handleRejectRequest = async (requestId) => {
    try {
      // Mock reject functionality
      setRequests(prev => prev.filter(r => r.id !== requestId));
      alert('Connection request declined! (Mock functionality)');
      // fetchRequests(); // Not needed with mock data
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };
  const handleSendRequest = async (receiverId) => {
    try {
      // Mock send request functionality
      const userToConnect = searchResults.find(u => u.id === receiverId);
      if (userToConnect) {
        const newRequest = {
          id: requests.length + 1,
          sender: userToConnect,
          sent_at: new Date().toISOString()
        };
        setRequests(prev => [...prev, newRequest]);
      }
      setSearchResults([]);
      setSearchQuery('');
      alert('Connection request sent! (Mock functionality)');
      // API call commented out
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
      // Mock search functionality - filter existing search results
      const filteredResults = searchResults.filter(user =>
        user.full_name.toLowerCase().includes(query.toLowerCase()) ||
        user.major.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredResults);
      // const response = await usersAPI.searchUsers(query);
      // setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };
  const handleRemoveConnection = async (connectionId) => {
    try {
      // Mock remove connection functionality
      setConnections(prev => prev.filter(c => c.id !== connectionId));
      alert('Connection removed! (Mock functionality)');
      // fetchConnections(); // Not needed with mock data
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
