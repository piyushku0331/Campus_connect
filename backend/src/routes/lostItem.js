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
const { uploadLostAndFound } = require('../middleware/cloudinaryUpload');

router.post('/', verifyToken, uploadLostAndFound, reportItem);
router.get('/', getAllItems);
router.put('/:id/status', verifyToken, updateItemStatus);
router.put('/:id/claim', verifyToken, claimItem);
router.delete('/:id', verifyToken, deleteItem);

module.exports = router;