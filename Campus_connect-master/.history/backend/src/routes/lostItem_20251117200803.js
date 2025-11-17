const express = require('express');
const router = express.Router();
const {
  reportItem,
  getAllItems,
  updateItemStatus,
  claimItem,
  deleteItem
} = require('../controllers/lostItemController');
const { verifyToken } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/lostitems/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

router.post('/', verifyToken, upload.single('image'), reportItem);
router.get('/', getAllItems);
router.put('/:id/status', verifyToken, updateItemStatus);
router.post('/:id/claim', verifyToken, claimItem);
router.delete('/:id', verifyToken, deleteItem);

module.exports = router;