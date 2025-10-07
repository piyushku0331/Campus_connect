const express = require('express');
const router = express.Router();
const { reportItem, getAllItems } = require('../controllers/lostItemController');
const authMiddleware = require('../middleware/authMiddleware');
const createUploader = require('../middleware/uploadMiddleware');

const itemImageUploader = createUploader('uploads/lostitems', 'itemImage');

router.post('/', authMiddleware, itemImageUploader, reportItem);
router.get('/', getAllItems);

module.exports = router;