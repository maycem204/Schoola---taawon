const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const auth = require('../middleware/auth');

router.use(auth); // Toutes les routes de messagerie nécessitent une authentification

router.get('/conversations', messageController.getConversations);
router.get('/conversations/:conversationId', messageController.getConversationMessages);
router.get('/unread-count', messageController.getUnreadCount);
router.post('/conversations', messageController.startConversation);
router.post('/', messageController.sendMessage);
router.post('/conversations/:conversationId/read', messageController.markAsRead);

module.exports = router;