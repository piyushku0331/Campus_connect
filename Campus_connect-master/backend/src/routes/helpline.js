const express = require('express');
const router = express.Router();
const {
  getAllHelplines,
  addHelpline,
  updateHelpline,
  deleteHelpline
} = require('../controllers/helplineController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', getAllHelplines);
router.post('/', verifyToken, addHelpline);
router.put('/:id', verifyToken, updateHelpline);
router.delete('/:id', verifyToken, deleteHelpline);

module.exports = router;