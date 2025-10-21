const { supabase } = require('../config');
const { awardPoints, checkAchievements } = require('./gamificationController');
const getConnections = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: connections, error } = await supabase
      .from('connections')
      .select(`
        *,
        sender:users!sender_id(id, full_name, avatar_url, bio, major, year),
        receiver:users!receiver_id(id, full_name, avatar_url, bio, major, year)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .eq('status', 'accepted');
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch connections' });
    }
    const formattedConnections = connections.map(conn => ({
      id: conn.id,
      status: conn.status,
      created_at: conn.created_at,
      user: conn.sender_id === userId ? conn.receiver : conn.sender
    }));
    res.json(formattedConnections);
  } catch (error) {
    console.error('Error fetching connections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const sendConnectionRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiver_id } = req.body;
    const { data: existingConnection } = await supabase
      .from('connections')
      .select('*')
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${senderId})`)
      .single();
    if (existingConnection) {
      return res.status(400).json({ error: 'Connection request already exists' });
    }
    if (senderId === receiver_id) {
      return res.status(400).json({ error: 'Cannot send connection request to yourself' });
    }
    const { data: connection, error } = await supabase
      .from('connections')
      .insert({
        sender_id: senderId,
        receiver_id
      })
      .select()
      .single();
    if (error) {
      return res.status(500).json({ error: 'Failed to send connection request' });
    }
    await awardPoints(senderId, 5, 'sent_connection_request', connection.id);
    res.status(201).json(connection);
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const acceptConnectionRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { data: connection } = await supabase
      .from('connections')
      .select('*')
      .eq('id', id)
      .eq('receiver_id', userId)
      .eq('status', 'pending')
      .single();
    if (!connection) {
      return res.status(404).json({ error: 'Connection request not found' });
    }
    const { data: updatedConnection, error } = await supabase
      .from('connections')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return res.status(500).json({ error: 'Failed to accept connection request' });
    }
    await awardPoints(userId, 15, 'accepted_connection', id);
    await awardPoints(connection.sender_id, 15, 'connection_accepted', id);
    await checkAchievements(userId);
    await checkAchievements(connection.sender_id);
    res.json(updatedConnection);
  } catch (error) {
    console.error('Error accepting connection request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const rejectConnectionRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { data: connection } = await supabase
      .from('connections')
      .select('*')
      .eq('id', id)
      .eq('receiver_id', userId)
      .eq('status', 'pending')
      .single();
    if (!connection) {
      return res.status(404).json({ error: 'Connection request not found' });
    }
    const { data: updatedConnection, error } = await supabase
      .from('connections')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return res.status(500).json({ error: 'Failed to reject connection request' });
    }
    res.json(updatedConnection);
  } catch (error) {
    console.error('Error rejecting connection request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const removeConnection = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { data: connection } = await supabase
      .from('connections')
      .select('*')
      .eq('id', id)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .eq('status', 'accepted')
      .single();
    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }
    const { error } = await supabase
      .from('connections')
      .delete()
      .eq('id', id);
    if (error) {
      return res.status(500).json({ error: 'Failed to remove connection' });
    }
    res.json({ message: 'Connection removed successfully' });
  } catch (error) {
    console.error('Error removing connection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const { data: requests, error } = await supabase
      .from('connections')
      .select(`
        *,
        sender:users!sender_id(id, full_name, avatar_url, bio, major, year)
      `)
      .eq('receiver_id', userId)
      .eq('status', 'pending');
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch connection requests' });
    }
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
