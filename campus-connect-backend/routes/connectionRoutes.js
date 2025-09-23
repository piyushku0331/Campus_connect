const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/request', authMiddleware, connectionController.sendConnectionRequest);
router.put('/:connectionId/accept', authMiddleware, connectionController.acceptConnection);
router.put('/:connectionId/decline', authMiddleware, connectionController.declineConnection);
router.delete('/:connectionId/withdraw', authMiddleware, connectionController.withdrawRequest);
router.get('/', authMiddleware, connectionController.getConnections);
router.get('/pending', authMiddleware, connectionController.getPendingRequests);
router.get('/sent', authMiddleware, connectionController.getSentRequests);
router.get('/discover', authMiddleware, connectionController.getDiscoverUsers);

module.exports = router;