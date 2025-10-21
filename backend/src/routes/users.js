const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware');
const { userController } = require('../controllers');
router.get('/profile', requireAuth, userController.getProfile);
router.put('/profile', requireAuth, userController.updateProfile);
router.get('/:id', requireAuth, userController.getUserById);
router.get('/', requireAuth, userController.searchUsers);
module.exports = router;
