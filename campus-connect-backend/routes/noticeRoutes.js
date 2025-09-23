const express = require('express');
const router = express.Router();
const { uploadNotice, getNotices } = require('../controllers/noticeController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', authMiddleware, adminMiddleware, upload, uploadNotice);
router.get('/', getNotices);

module.exports = router;