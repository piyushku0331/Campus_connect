const express = require('express');
const router = express.Router();
const {
  postPlacement,
  getPlacements,
  getSuccessStories,
  updatePlacement,
  deletePlacement
} = require('../controllers/placementController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, postPlacement);
router.get('/', getPlacements);
router.get('/success-stories', getSuccessStories);
router.put('/:id', verifyToken, updatePlacement);
router.delete('/:id', verifyToken, deletePlacement);

module.exports = router;