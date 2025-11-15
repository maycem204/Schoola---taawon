const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const auth = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(auth);

// GET /api/notifications - Obtenir les notifications
router.get('/', notificationController.getNotifications);

// PUT /api/notifications/:notificationId/read - Marquer comme lue
router.put('/:notificationId/read', notificationController.markAsRead);

// PUT /api/notifications/read-all - Marquer toutes comme lues
router.put('/read-all', notificationController.markAllAsRead);

// DELETE /api/notifications/:notificationId - Supprimer
router.delete('/:notificationId', notificationController.deleteNotification);

module.exports = router;
