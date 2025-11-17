const express = require('express');
const router = express.Router();
const {
  uploadNotice,
  getNotices,
  getNoticeById,
  deleteNotice
} = require('../controllers/noticeController');
const { verifyToken } = require('../middleware/authMiddleware');
const { uploadResourcePDF } = require('../middleware/cloudinaryUpload');

router.post('/', verifyToken, uploadResourcePDF, uploadNotice);
router.get('/', getNotices);
router.get('/:id', getNoticeById);
router.delete('/:id', verifyToken, deleteNotice);

module.exports = router;