const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getConversations,
  getConversation,
  createConversation,
  sendMessage
} = require('../controllers/conversationController');

// All routes require authentication
router.use(verifyToken);

// Get all conversations for the authenticated user
router.get('/', getConversations);

// Create a new conversation
router.post('/', createConversation);

// Get a specific conversation
router.get('/:conversationId', getConversation);

// Send a message in a conversation
router.post('/:conversationId/messages', sendMessage);

module.exports = router;