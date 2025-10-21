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
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    if (!user.isVerified) {
      return res.status(400).json({ error: 'Please verify your email first' });
    }
    const token = generateToken(user._id);
    res.status(200).json({
      message: 'Sign in successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar_url: user.avatar_url
        },
        session: {
          access_token: token
        }
      }
    });
  } catch (err) {
    console.error('Sign in internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const signOut = async (req, res) => {
  try {
    res.status(200).json({ message: 'Sign out successful' });
  } catch (err) {
    console.error('Sign out internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const sendOTP = async (req, res) => {
  const { email, type = 'recovery' } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (typeof email !== 'string') {
    return res.status(400).json({ error: 'Email must be a string' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();
    try {
      await sendOTPEmail(email, otp);
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
const verifyOTP = async (req, res) => {
  const { email, token, type = 'recovery' } = req.body;
  if (!email || !token) {
    return res.status(400).json({ error: 'Email and token are required' });
  }
  if (typeof email !== 'string' || typeof token !== 'string') {
    return res.status(400).json({ error: 'Email and token must be strings' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.otp !== token || user.otpExpires < new Date()) {
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
          access_token: jwtToken
        }
      }
    });
  } catch (err) {
    console.error('Verify OTP internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -otp -otpExpires');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error('Get current user internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const refreshToken = async (req, res) => {
  try {
    res.status(200).json({ message: 'Token refresh not implemented yet' });
  } catch (err) {
    console.error('Refresh token internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {
  signUp,
  signIn,
  signOut,
  sendOTP,
  verifyOTP,
  getCurrentUser,
  refreshToken,
};
