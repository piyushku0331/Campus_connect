const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadProfilePicture } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', getProfile);
router.put('/', authMiddleware, uploadProfilePicture, updateProfile);

module.exports = router;