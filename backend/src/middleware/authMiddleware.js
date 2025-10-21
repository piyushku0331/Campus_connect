const { supabase } = require('../config');
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }
    const token = authHeader.substring(7); 
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      console.error('Token verification error:', error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification internal error:', err);
    res.status(500).json({ error: 'Internal server error during token verification' });
  }
};
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};
module.exports = {
  verifyToken,
  requireAuth,
};
