const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', getProfile);
router.put('/', authMiddleware, updateProfile);

module.exports = router;