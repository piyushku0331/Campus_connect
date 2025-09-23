const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  try {
    // We assume authMiddleware has already run and attached the user id to req.user.id
    const user = await User.findById(req.user.id);

    if (user && user.role === 'Admin') {
      next();
    } else {
      res.status(403).json({ msg: 'Access denied. Admins only.' });
    }
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

module.exports = adminMiddleware;