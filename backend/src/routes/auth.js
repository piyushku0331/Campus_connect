const express = require('express');
const router = express.Router();
const {
  signUp,
  signIn,
  signOut,
  sendOTP,
  verifyOTP,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  refreshToken
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { uploadUserProfile } = require('../middleware/cloudinaryUpload');

router.post('/signup', uploadUserProfile, signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/current-user', verifyToken, getCurrentUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);

module.exports = router;
