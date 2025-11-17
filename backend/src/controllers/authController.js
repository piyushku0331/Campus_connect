const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendAdminNewUserNotification
} = require('../utils/emailService');
const logger = require('../utils/logger');
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '1h'
  });
};
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};
const signUp = async (req, res) => {
  const { email, password, name, age, department, semester, campus, year, phone, bio, linkedin, github, website, skills, interests } = req.body;
  const photoFile = req.file;

  // Input validation
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
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name is required and must be a string' });
  }
  if (!age || isNaN(parseInt(age)) || parseInt(age) < 16 || parseInt(age) > 30) {
    return res.status(400).json({ error: 'Age must be a number between 16 and 30' });
  }
  if (!department || typeof department !== 'string') {
    return res.status(400).json({ error: 'Department is required and must be a string' });
  }
  if (!semester || typeof semester !== 'string') {
    return res.status(400).json({ error: 'Semester is required and must be a string' });
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
      name,
      age: parseInt(age),
      department,
      semester,
      campus,
      year,
      phone,
      bio,
      linkedin,
      github,
      website,
      skills,
      interests,
      profilePicture: photoUrl,
      otp,
      otpExpires
    });

    await user.save();

    try {
      await sendOTPEmail(email, otp, name);
    } catch (emailError) {
      logger.error('Failed to send OTP email:', emailError);
    }

    try {
      await sendAdminNewUserNotification(
        process.env.ADMIN_EMAIL || 'admin@campusconnect.com',
        { name, email, department, semester, age }
      );
    } catch (adminEmailError) {
      logger.error('Failed to send admin notification:', adminEmailError);
    }

    res.status(200).json({
      message: 'Sign up successful. Check your email for OTP verification.',
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (err) {
    logger.error('Sign up internal error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
const signIn = async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password must be strings' });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: 'Please verify your email first' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const jwtToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.refreshTokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();

    // Set refresh token as httpOnly cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json({
      message: 'Sign in successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar_url: user.avatar_url || user.profilePicture
        },
        session: {
          access_token: jwtToken
        }
      }
    });
  } catch (err) {
    logger.error('Sign in internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const signOut = async (req, res) => {
  try {
    // Clear refresh token from database
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user) {
        user.refreshToken = null;
        user.refreshTokenExpires = null;
        await user.save();
      }
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({ message: 'Sign out successful' });
  } catch (err) {
    logger.error('Sign out internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpires -refreshToken -refreshTokenExpires -resetPasswordToken -resetPasswordExpires');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (err) {
    logger.error('Get current user internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const sendOTP = async (req, res) => {
  const { email } = req.body;
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
    logger.info(`Generated OTP for ${trimmedEmail}`);
    try {
      await sendOTPEmail(trimmedEmail, otp, user.name);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (emailError) {
      logger.error('Failed to send OTP email:', emailError);
      res.status(500).json({ error: 'Failed to send OTP email' });
    }
  } catch (err) {
    logger.error('Send OTP internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }
  if (typeof email !== 'string' || typeof otp !== 'string') {
    return res.status(400).json({ error: 'Email and OTP must be strings' });
  }
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedOtp = otp.trim();
  if (!validateEmail(trimmedEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  try {
    const user = await User.findOne({ email: trimmedEmail }).select('+otp +otpExpires');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure both are strings for comparison
    const storedOtp = String(user.otp).trim();
    const enteredOtp = String(trimmedOtp).trim();

    // Do not log OTP values or sensitive comparison results

    if (storedOtp !== enteredOtp || user.otpExpires < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    try {
      await sendWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      logger.error('Failed to send welcome email:', emailError);
    }
    const jwtToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    user.refreshTokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();

    // Set refresh token as httpOnly cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json({
      message: 'OTP verified successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          avatar_url: user.avatar_url || user.profilePicture
        },
        session: {
          access_token: jwtToken
        }
      }
    });
  } catch (err) {
    logger.error('Verify OTP internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
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
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();
    try {
      await sendPasswordResetEmail(trimmedEmail, resetToken, { name: user.name });
      res.status(200).json({ message: 'Password reset email sent. Please check your email.' });
    } catch (emailError) {
      logger.error('Failed to send password reset email:', emailError);
      res.status(500).json({ error: 'Failed to send password reset email' });
    }
  } catch (err) {
    logger.error('Forgot password internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }
  if (typeof token !== 'string' || typeof newPassword !== 'string') {
    return res.status(400).json({ error: 'Token and new password must be strings' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  try {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json({ message: 'Password reset successfully. You can now login with your new password.' });
  } catch (err) {
    logger.error('Reset password internal error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not found' });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken || user.refreshTokenExpires < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
    const newAccessToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    user.refreshTokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await user.save();

    // Set new refresh token as httpOnly cookie
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json({
      message: 'Token refreshed successfully',
      data: {
        session: {
          access_token: newAccessToken
        }
      }
    });
  } catch (err) {
    logger.error('Refresh token internal error:', err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
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
  forgotPassword,
  resetPassword,
  refreshToken,
};
