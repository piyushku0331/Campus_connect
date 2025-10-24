const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
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
router.post('/signup', upload.single('photo'), authController.signUp);
router.post('/signin', authController.signIn);
router.post('/signout', verifyToken, authController.signOut); 
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
router.get('/current-user', verifyToken, authController.getCurrentUser); 
router.post('/refresh-token', authController.refreshToken);
module.exports = router;
