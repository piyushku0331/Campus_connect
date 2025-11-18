const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.header('x-auth-token');
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (authHeader) {
      token = authHeader;
    }

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId || decoded.user.id);

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = {
      id: user._id,
      role: user.role || 'user'
    };
    next();
  } catch (err) {
    logger.error('Token verification error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(500).json({ error: 'Internal server error during token verification' });
  }
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = {
  verifyToken,
  requireAuth,
  requireAdmin
};
