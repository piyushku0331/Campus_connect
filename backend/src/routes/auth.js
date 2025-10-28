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
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

router.post('/signup', upload.single('photo'), signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/current-user', verifyToken, getCurrentUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);

module.exports = router;
