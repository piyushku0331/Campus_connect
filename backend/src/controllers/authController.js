const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendAdminNewUserNotification
} = require('../utils/emailService');
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
const generateToken = (userId) => {
  const { config } = require('../config');
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expire
  });
};
const generateRefreshToken = (userId) => {
  const { config } = require('../config');
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: '30d'
  });
};
const signUp = async (req, res) => {
  const { email, password, fullName, age, branch, year } = req.body;
  const photoFile = req.file;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password must be strings' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (!email.endsWith('@chitkara.edu.in')) {
    return res.status(400).json({ error: 'Only @chitkara.edu.in email addresses are allowed' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  if (!fullName || typeof fullName !== 'string') {
    return res.status(400).json({ error: 'Full name is required and must be a string' });
  }
  if (!age || isNaN(parseInt(age)) || parseInt(age) < 16 || parseInt(age) > 30) {
    return res.status(400).json({ error: 'Age must be a number between 16 and 30' });
  }
  if (!branch || typeof branch !== 'string') {
    return res.status(400).json({ error: 'Branch is required and must be a string' });
  }
  if (!year || typeof year !== 'string') {
    return res.status(400).json({ error: 'Year is required and must be a string' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 
    let photoUrl = null;
    if (photoFile) {
      photoUrl = `uploads/${Date.now()}-${photoFile.originalname}`;
    }
    const user = new User({
      email,
      password,
      name: fullName,
      age: parseInt(age),
      department: branch,
      semester: year,
      avatar_url: photoUrl,
      otp,
      otpExpires
    });
    await user.save();
    try {
      await sendOTPEmail(email, otp, fullName);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
    }
    try {
      await sendAdminNewUserNotification(
        process.env.ADMIN_EMAIL || 'admin@campusconnect.com',
        { name: fullName, email, department: branch, semester: year, age }
      );
    } catch (adminEmailError) {
      console.error('Failed to send admin notification:', adminEmailError);
    }
    res.status(200).json({
      message: 'Sign up successful. Check your email for OTP verification.',
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (err) {
    console.error('Sign up internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const signIn = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password must be strings' });
  }
  // Hardcoded credentials for testing
  const HARDCODED_EMAIL = 'piyush1093.be23@chitkara.edu.in';
  const HARDCODED_PASSWORD = 'Piyush@123';

  if (email.trim().toLowerCase() === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
    // Create a mock user object
    const mockUser = {
      _id: '507f1f77bcf86cd799439011', // Mock ObjectId
      email: HARDCODED_EMAIL,
      name: 'Piyush',
      avatar_url: null
    };

    res.status(200).json({
      message: 'Sign in successful',
      data: {
        user: {
          id: mockUser._id,
          email: mockUser.email,
          name: mockUser.name,
          avatar_url: mockUser.avatar_url
        },
        session: {
          access_token: 'mock_jwt_token',
          refresh_token: 'mock_refresh_token'
        }
      }
    });
  } else {
    return res.status(400).json({ error: 'Invalid email or password' });
  }
};
const signOut = async (req, res) => {
  try {
    // No JWT token cleanup needed for hardcoded auth
    res.status(200).json({ message: 'Sign out successful' });
  } catch (err) {
    console.error('Sign out internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
/*
const sendOTP = async (req, res) => {
  const { email, type = 'recovery' } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (typeof email !== 'string') {
    return res.status(400).json({ error: 'Email must be a string' });
  }
  const trimmedEmail = email.trim().toLowerCase();
  if (!validateEmail(trimmedEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  try {
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    console.log('Generated OTP for', trimmedEmail, ':', otp); // Debug log
    try {
      await sendOTPEmail(trimmedEmail, otp);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      res.status(500).json({ error: 'Failed to send OTP email' });
    }
  } catch (err) {
    console.error('Send OTP internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
*/
/*
const verifyOTP = async (req, res) => {
  const { email, token, type = 'recovery' } = req.body;
  if (!email || !token) {
    return res.status(400).json({ error: 'Email and token are required' });
  }
  if (typeof email !== 'string' || typeof token !== 'string') {
    return res.status(400).json({ error: 'Email and token must be strings' });
  }
  // Trim whitespace from inputs
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedToken = token.trim();
  if (!validateEmail(trimmedEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  try {
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('Debug OTP verification:');
    console.log('Stored OTP:', user.otp);
    console.log('Entered token (trimmed):', trimmedToken);
    console.log('OTP Expires:', user.otpExpires);
    console.log('Current time:', new Date());
    console.log('Is expired:', user.otpExpires < new Date());
    console.log('OTP match:', user.otp === trimmedToken);
    if (user.otp !== trimmedToken || user.otpExpires < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }
    const jwtToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    user.refreshTokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();
    res.status(200).json({
      message: 'OTP verified successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar_url: user.avatar_url
        },
        session: {
          access_token: jwtToken,
          refresh_token: refreshToken
        }
      }
    });
  } catch (err) {
    console.error('Verify OTP internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
*/
const getCurrentUser = async (req, res) => {
  try {
    // Return mock user for hardcoded auth
    const mockUser = {
      id: '507f1f77bcf86cd799439011',
      email: 'piyush1093.be23@chitkara.edu.in',
      name: 'Piyush',
      avatar_url: null,
      age: 20,
      department: 'Computer Science',
      semester: 'BE23'
    };
    res.status(200).json({ user: mockUser });
  } catch (err) {
    console.error('Get current user internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
/*
const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    const decoded = jwt.verify(refresh_token, config.jwt.secret);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refresh_token || user.refreshTokenExpires < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    user.refreshTokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();
    res.status(200).json({
      message: 'Token refreshed successfully',
      data: {
        session: {
          access_token: newAccessToken,
          refresh_token: newRefreshToken
        }
      }
    });
  } catch (err) {
    console.error('Refresh token internal error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
*/
module.exports = {
  signUp,
  signIn,
  signOut,
  // sendOTP,
  // verifyOTP,
  getCurrentUser,
  // refreshToken,
};
