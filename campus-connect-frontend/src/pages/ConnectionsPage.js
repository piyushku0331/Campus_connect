import React, { useState, useEffect } from 'react';
import { connectionsAPI } from '../services/api';
import '../assets/styles/pages/ConnectionsPage.css';

// Main component for handling all the networking stuff
// Basically lets students find each other and connect
const ConnectionsPage = () => {
  // Keeping track of which tab we're on and all the user data
  const [activeTab, setActiveTab] = useState('discover');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]); // People you can connect with
  const [connections, setConnections] = useState([]); // Your actual connections
  const [pendingRequests, setPendingRequests] = useState([]); // People who want to connect with you
  const [sentRequests, setSentRequests] = useState([]); // Requests you've sent out

  // TODO: Maybe add some loading states for better UX

  // Load all the connection data when the page first loads
  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUserId = localStorage.getItem('userId');

        // Grab all the data at once - connections, requests, etc.
        const [connectionsRes, pendingRes, sentRes, discoverRes] = await Promise.all([
          connectionsAPI.getConnections(),
          connectionsAPI.getPendingRequests(),
          connectionsAPI.getSentRequests(),
          connectionsAPI.getDiscoverUsers()
        ]);

        // Don't show yourself in the discover list
        const filteredDiscoverUsers = discoverRes.filter(user => user.id !== currentUserId);

        setConnections(connectionsRes);
        setPendingRequests(pendingRes);
        setSentRequests(sentRes);
        setUsers(filteredDiscoverUsers);
      } catch (error) {
        console.error('Oops, error loading connections:', error);
      }
    };

    loadData();
  }, []);

  // Filter the users list based on what someone types in the search box
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // When someone clicks connect on a user
  const handleConnect = async (userId) => {
    try {
      // Update the UI right away so it feels snappy
      const targetUser = users.find(user => user.id === userId);
      if (targetUser) {
        setUsers(prev => prev.filter(user => user.id !== userId));
        setSentRequests(prev => [...prev, { ...targetUser, status: 'sent', connectionId: 'mock-sent-' + userId }]);
      }

      await connectionsAPI.sendConnectionRequest(userId);
    } catch (error) {
      console.error('Failed to send connection request:', error);
      // If it fails, reload everything to get back in sync
      const [sentRes, discoverRes] = await Promise.all([
        connectionsAPI.getSentRequests(),
        connectionsAPI.getDiscoverUsers()
      ]);
      setSentRequests(sentRes);
      setUsers(discoverRes);
    }
  };

  // Accepting a connection request
  const handleAccept = async (connectionId) => {
    try {
      // Update UI immediately
      setPendingRequests(prev => prev.filter(user => user.connectionId !== connectionId));

      const acceptedUser = pendingRequests.find(user => user.connectionId === connectionId);
      if (acceptedUser) {
        setConnections(prev => [...prev, { ...acceptedUser, status: 'connected' }]);
      }

      await connectionsAPI.acceptConnection(connectionId);
    } catch (error) {
      console.error('Error accepting connection:', error);
      // Reload if something went wrong
      const [connectionsRes, pendingRes] = await Promise.all([
        connectionsAPI.getConnections(),
        connectionsAPI.getPendingRequests()
      ]);
      setConnections(connectionsRes);
      setPendingRequests(pendingRes);
    }
  };

  // Declining a connection request
  const handleDecline = async (connectionId) => {
    try {
      setPendingRequests(prev => prev.filter(user => user.connectionId !== connectionId));
      await connectionsAPI.declineConnection(connectionId);
    } catch (error) {
      console.error('Error declining connection:', error);
      const pendingRes = await connectionsAPI.getPendingRequests();
      setPendingRequests(pendingRes);
    }
  };

  // Withdrawing a request you sent
  const handleWithdraw = async (connectionId) => {
    try {
      setSentRequests(prev => prev.filter(user => user.connectionId !== connectionId));
      await connectionsAPI.withdrawRequest(connectionId);
    } catch (error) {
      console.error('Error withdrawing request:', error);
      const sentRes = await connectionsAPI.getSentRequests();
      setSentRequests(sentRes);
    }
  };

  // Get initials from a name for the avatar
  const getUserInitials = (name) => {
    const words = name.trim().split(' ').filter(word => word.length > 0);
    if (words.length === 0) return '?';
    const firstInitial = words[0].charAt(0).toUpperCase();
    const lastInitial = words.length > 1 ? words[words.length - 1].charAt(0).toUpperCase() : '';
    return (firstInitial + lastInitial).slice(0, 2);
  };

  // Pick a nice gradient color for the avatar based on name
  const getAvatarColor = (name) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  // Could probably extract this into a separate component later

  // Render a card for each user
  const renderUserCard = (user) => (
    <div key={user.id} className="user-card">
      <div className="user-card-header">
        <div
          className="user-avatar"
          style={{ background: getAvatarColor(user.name) }}
        >
          {getUserInitials(user.name)}
        </div>
        <div className="user-actions">
          {user.status === 'none' && (
            <button
              className="btn-connect"
              onClick={() => handleConnect(user.id)}
            >
              Connect
            </button>
          )}
          {user.status === 'connected' && (
            <span className="connection-status connected">Connected</span>
          )}
          {user.status === 'pending' && (
            <div className="pending-actions">
              <button
                className="btn-accept"
                onClick={() => handleAccept(user.connectionId)}
              >
                Accept
              </button>
              <button
                className="btn-decline"
                onClick={() => handleDecline(user.connectionId)}
              >
                Decline
              </button>
            </div>
          )}
          {user.status === 'sent' && (
            <button
              className="btn-withdraw"
              onClick={() => handleWithdraw(user.connectionId)}
            >
              Pending
            </button>
          )}
        </div>
      </div>

      <div className="user-info">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-role">{user.role}</p>
        <p className="user-details">{user.year} • {user.department}</p>

        <div className="user-stats">
          <span className="mutual-connections">
            {user.mutualConnections} mutual connections
          </span>
        </div>

        <div className="user-skills">
          {user.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
          {user.skills.length > 3 && (
            <span className="skill-more">+{user.skills.length - 3} more</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="connections-page">
      <div className="page-header">
        <h1>My Network</h1>
        <p>Connect with fellow students and build your professional network</p>
      </div>

      <div className="connections-tabs">
        <button
          className={`tab-btn ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          Discover People
        </button>
        <button
          className={`tab-btn ${activeTab === 'connections' ? 'active' : ''}`}
          onClick={() => setActiveTab('connections')}
        >
          My Connections ({connections.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests ({pendingRequests.length})
        </button>
      </div>

      {activeTab === 'discover' && (
        <div className="discover-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name, role, department, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="users-grid">
            {filteredUsers.map(renderUserCard)}
          </div>
        </div>
      )}

      {activeTab === 'connections' && (
        <div className="connections-section">
          <h2>Your Connections</h2>
          {connections.length > 0 ? (
            <div className="users-grid">
              {connections.map(renderUserCard)}
            </div>
          ) : (
            <div className="empty-state">
              <p>You haven't connected with anyone yet. Start by discovering people!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="requests-section">
          <h2>Connection Requests</h2>
          {pendingRequests.length > 0 ? (
            <div className="users-grid">
              {pendingRequests.map(renderUserCard)}
            </div>
          ) : (
            <div className="empty-state">
              <p>No pending connection requests.</p>
            </div>
          )}

          {sentRequests.length > 0 && (
            <>
              <h2>Sent Requests</h2>
              <div className="users-grid">
                {sentRequests.map(renderUserCard)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionsPage;

// Note: This component is getting a bit long, might want to split it up eventually