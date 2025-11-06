const Connection = require('../models/Connection');
const { awardPoints, checkAchievements } = require('./gamificationController');
const getConnections = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const connections = await Connection.find({
      $or: [
        { sender_id: userId },
        { receiver_id: userId }
      ],
      status: 'accepted'
    }).populate('sender_id', 'name email profilePicture bio department semester')
      .populate('receiver_id', 'name email profilePicture bio department semester');

    const formattedConnections = connections.map(conn => ({
      id: conn._id,
      status: conn.status,
      created_at: conn.created_at,
      user: conn.sender_id._id.toString() === userId ? conn.receiver_id : conn.sender_id
    }));
    res.json(formattedConnections);
  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const sendConnectionRequest = async (req, res) => {
  try {
    const senderId = req.user?.id;
    if (!senderId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { receiver_id } = req.body;
    const existingConnection = await Connection.findOne({
      $or: [
        { sender_id: senderId, receiver_id: receiver_id },
        { sender_id: receiver_id, receiver_id: senderId }
      ]
    });
    if (existingConnection) {
      return res.status(400).json({ error: 'Connection request already exists' });
    }
    if (senderId === receiver_id) {
      return res.status(400).json({ error: 'Cannot send connection request to yourself' });
    }
    const connection = new Connection({
      sender_id: senderId,
      receiver_id
    });
    await connection.save();
    await awardPoints(senderId, 5, 'sent_connection_request', connection._id);
    res.status(201).json(connection);
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const acceptConnectionRequest = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { id } = req.params;
    const connection = await Connection.findOne({
      _id: id,
      receiver_id: userId,
      status: 'pending'
    });
    if (!connection) {
      return res.status(404).json({ error: 'Connection request not found' });
    }
    connection.status = 'accepted';
    connection.updated_at = new Date();
    await connection.save();
    await awardPoints(userId, 15, 'accepted_connection', id);
    await awardPoints(connection.sender_id, 15, 'connection_accepted', id);
    await checkAchievements(userId);
    await checkAchievements(connection.sender_id);
    res.json(connection);
  } catch (error) {
    console.error('Error accepting connection request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const rejectConnectionRequest = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { id } = req.params;
    const connection = await Connection.findOne({
      _id: id,
      receiver_id: userId,
      status: 'pending'
    });
    if (!connection) {
      return res.status(404).json({ error: 'Connection request not found' });
    }
    connection.status = 'rejected';
    connection.updated_at = new Date();
    await connection.save();
    res.json(connection);
  } catch (error) {
    console.error('Error rejecting connection request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const removeConnection = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const { id } = req.params;
    const connection = await Connection.findOne({
      _id: id,
      $or: [
        { sender_id: userId },
        { receiver_id: userId }
      ],
      status: 'accepted'
    });
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }
    await Connection.deleteOne({ _id: id });
    res.json({ message: 'Connection removed successfully' });
  } catch (error) {
    console.error('Error removing connection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const requests = await Connection.find({
      receiver_id: userId,
      status: 'pending'
    }).populate('sender_id', 'name email profilePicture bio department semester');
    res.json(requests);
  } catch (error) {
    console.error('Error fetching connection requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {
  getConnections,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection,
  getConnectionRequests
};
