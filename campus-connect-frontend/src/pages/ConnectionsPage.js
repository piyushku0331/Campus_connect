import React, { useState, useEffect } from 'react';
import '../assets/styles/pages/ConnectionsPage.css';

const ConnectionsPage = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        name: 'Sarah Chen',
        role: 'Computer Science Student',
        year: '3rd Year',
        department: 'Computer Science',
        skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
        mutualConnections: 5,
        profilePicture: null,
        status: 'none' // none, connected, pending, sent
      },
      {
        id: 2,
        name: 'Mike Rodriguez',
        role: 'Electrical Engineering Student',
        year: '2nd Year',
        department: 'Electrical Engineering',
        skills: ['Circuit Design', 'Embedded Systems', 'IoT'],
        mutualConnections: 3,
        profilePicture: null,
        status: 'connected'
      },
      {
        id: 3,
        name: 'Emily Davis',
        role: 'Data Science Student',
        year: '4th Year',
        department: 'Mathematics',
        skills: ['Python', 'R', 'Statistics', 'Data Visualization'],
        mutualConnections: 8,
        profilePicture: null,
        status: 'pending'
      },
      {
        id: 4,
        name: 'David Kumar',
        role: 'AI Research Assistant',
        year: 'PhD Student',
        department: 'Computer Science',
        skills: ['Deep Learning', 'TensorFlow', 'Computer Vision'],
        mutualConnections: 12,
        profilePicture: null,
        status: 'sent'
      },
      {
        id: 5,
        name: 'Lisa Wang',
        role: 'UX Designer',
        year: '3rd Year',
        department: 'Design',
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        mutualConnections: 6,
        profilePicture: null,
        status: 'none'
      },
      {
        id: 6,
        name: 'Alex Thompson',
        role: 'Business Administration Student',
        year: '2nd Year',
        department: 'Business',
        skills: ['Marketing', 'Finance', 'Entrepreneurship'],
        mutualConnections: 4,
        profilePicture: null,
        status: 'none'
      }
    ];

    const mockConnections = mockUsers.filter(user => user.status === 'connected');
    const mockPending = mockUsers.filter(user => user.status === 'pending');
    const mockSent = mockUsers.filter(user => user.status === 'sent');

    setUsers(mockUsers);
    setConnections(mockConnections);
    setPendingRequests(mockPending);
    setSentRequests(mockSent);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleConnect = (userId) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, status: 'sent' } : user
      )
    );
    // In a real app, this would make an API call
  };

  const handleAccept = (userId) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, status: 'connected' } : user
      )
    );
    setPendingRequests(prev => prev.filter(user => user.id !== userId));
    // In a real app, this would make an API call
  };

  const handleDecline = (userId) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, status: 'none' } : user
      )
    );
    setPendingRequests(prev => prev.filter(user => user.id !== userId));
    // In a real app, this would make an API call
  };

  const handleWithdraw = (userId) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, status: 'none' } : user
      )
    );
    setSentRequests(prev => prev.filter(user => user.id !== userId));
    // In a real app, this would make an API call
  };

  const getUserInitials = (name) => {
    const words = name.trim().split(' ').filter(word => word.length > 0);
    if (words.length === 0) return '?';
    const firstInitial = words[0].charAt(0).toUpperCase();
    const lastInitial = words.length > 1 ? words[words.length - 1].charAt(0).toUpperCase() : '';
    return (firstInitial + lastInitial).slice(0, 2);
  };

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
                onClick={() => handleAccept(user.id)}
              >
                Accept
              </button>
              <button
                className="btn-decline"
                onClick={() => handleDecline(user.id)}
              >
                Decline
              </button>
            </div>
          )}
          {user.status === 'sent' && (
            <button
              className="btn-withdraw"
              onClick={() => handleWithdraw(user.id)}
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