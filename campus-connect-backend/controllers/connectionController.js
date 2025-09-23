const Connection = require('../models/Connection');
const User = require('../models/User');

// Send connection request
exports.sendConnectionRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    if (senderId === receiverId) {
      return res.status(400).json({ message: 'Cannot send request to yourself' });
    }

    // For mock implementation, just return success
    // In production, this would save to database
    res.status(201).json({
      message: 'Connection request sent',
      connection: { _id: 'mock-connection-id', sender: senderId, receiver: receiverId }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Accept connection request
exports.acceptConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;

    // For mock implementation, just return success
    // In production, this would update the database
    res.json({
      message: 'Connection accepted',
      connection: { _id: connectionId, status: 'accepted' }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Decline connection request
exports.declineConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;

    // For mock implementation, just return success
    // In production, this would update the database
    res.json({
      message: 'Connection declined',
      connection: { _id: connectionId, status: 'declined' }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's connections
exports.getConnections = async (req, res) => {
  try {
    const userId = req.user.id;

    // Mock data for demonstration - in production, this would query the database
    const mockUsers = [
      {
        id: '2',
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
        id: '8',
        name: 'Rahul Verma',
        role: 'Civil Engineering Student',
        year: '4th Year',
        department: 'Civil Engineering',
        skills: ['AutoCAD', 'Structural Analysis', 'Construction Management'],
        mutualConnections: 9,
        profilePicture: null,
        status: 'connected'
      }
    ];

    // In a real implementation, you would query the database for accepted connections
    res.json(mockUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pending requests received
exports.getPendingRequests = async (req, res) => {
  try {
    // Mock data for demonstration - in production, this would query the database
    const mockPendingRequests = [
      {
        id: '3',
        name: 'Emily Davis',
        role: 'Data Science Student',
        year: '4th Year',
        department: 'Mathematics',
        skills: ['Python', 'R', 'Statistics', 'Data Visualization'],
        mutualConnections: 8,
        profilePicture: null,
        status: 'pending',
        connectionId: 'mock-connection-1'
      },
      {
        id: '10',
        name: 'Vikram Singh',
        role: 'Information Technology Student',
        year: '3rd Year',
        department: 'Information Technology',
        skills: ['Java', 'Database Management', 'Cybersecurity'],
        mutualConnections: 6,
        profilePicture: null,
        status: 'pending',
        connectionId: 'mock-connection-2'
      }
    ];

    // In a real implementation, you would query the database for pending requests
    res.json(mockPendingRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get sent requests
exports.getSentRequests = async (req, res) => {
  try {
    // Mock data for demonstration - in production, this would query the database
    const mockSentRequests = [
      {
        id: '4',
        name: 'David Kumar',
        role: 'AI Research Assistant',
        year: 'PhD Student',
        department: 'Computer Science',
        skills: ['Deep Learning', 'TensorFlow', 'Computer Vision'],
        mutualConnections: 12,
        profilePicture: null,
        status: 'sent',
        connectionId: 'mock-connection-3'
      }
    ];

    // In a real implementation, you would query the database for sent pending requests
    res.json(mockSentRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Withdraw sent request
exports.withdrawRequest = async (req, res) => {
  try {
    const { connectionId } = req.params;

    // For mock implementation, just return success
    // In production, this would delete from database
    res.json({ message: 'Request withdrawn' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users for discovery (excluding self and existing connections)
exports.getDiscoverUsers = async (req, res) => {
  try {
    const userId = req.user.id;

    // Mock data for demonstration - in production, this would query the database
    const mockUsers = [
      {
        id: '1',
        name: 'Sarah Chen',
        role: 'Computer Science Student',
        year: '3rd Year',
        department: 'Computer Science',
        skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
        mutualConnections: 5,
        profilePicture: null,
        status: 'none'
      },
      {
        id: '2',
        name: 'Mike Rodriguez',
        role: 'Electrical Engineering Student',
        year: '2nd Year',
        department: 'Electrical Engineering',
        skills: ['Circuit Design', 'Embedded Systems', 'IoT'],
        mutualConnections: 3,
        profilePicture: null,
        status: 'none'
      },
      {
        id: '3',
        name: 'Emily Davis',
        role: 'Data Science Student',
        year: '4th Year',
        department: 'Mathematics',
        skills: ['Python', 'R', 'Statistics', 'Data Visualization'],
        mutualConnections: 8,
        profilePicture: null,
        status: 'none'
      },
      {
        id: '4',
        name: 'David Kumar',
        role: 'AI Research Assistant',
        year: 'PhD Student',
        department: 'Computer Science',
        skills: ['Deep Learning', 'TensorFlow', 'Computer Vision'],
        mutualConnections: 12,
        profilePicture: null,
        status: 'none'
      },
      {
        id: '5',
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
        id: '6',
        name: 'Alex Thompson',
        role: 'Business Administration Student',
        year: '2nd Year',
        department: 'Business',
        skills: ['Marketing', 'Finance', 'Entrepreneurship'],
        mutualConnections: 4,
        profilePicture: null,
        status: 'none'
      },
      {
        id: '7',
        name: 'Priya Sharma',
        role: 'Mechanical Engineering Student',
        year: '3rd Year',
        department: 'Mechanical Engineering',
        skills: ['CAD', 'SolidWorks', 'Thermodynamics', 'Fluid Mechanics'],
        mutualConnections: 7,
        profilePicture: null,
        status: 'none'
      },
      {
        id: '8',
        name: 'Rahul Verma',
        role: 'Civil Engineering Student',
        year: '4th Year',
        department: 'Civil Engineering',
        skills: ['AutoCAD', 'Structural Analysis', 'Construction Management'],
        mutualConnections: 9,
        profilePicture: null,
        status: 'none'
      },
      {
        id: '9',
        name: 'Ananya Patel',
        role: 'Biotechnology Student',
        year: '2nd Year',
        department: 'Biotechnology',
        skills: ['Molecular Biology', 'Genetics', 'Lab Techniques'],
        mutualConnections: 4,
        profilePicture: null,
        status: 'none'
      },
      {
        id: '10',
        name: 'Vikram Singh',
        role: 'Information Technology Student',
        year: '3rd Year',
        department: 'Information Technology',
        skills: ['Java', 'Database Management', 'Cybersecurity'],
        mutualConnections: 6,
        profilePicture: null,
        status: 'none'
      }
    ];

    // Filter out current user (assuming userId might match one of the mock IDs)
    const filteredUsers = mockUsers.filter(user => user.id !== userId);

    // In a real implementation, you would also filter out existing connections
    // For now, return all mock users except current user
    res.json(filteredUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};