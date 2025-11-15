const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Route de test pour envoyer une notification
router.get('/test-send/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        console.log('🧪 TEST: Envoi notification à:', userId);
        
        // Créer une notification de test
        const notification = {
            _id: Date.now().toString(),
            recipient: userId,
            sender: userId,
            type: 'like',
            title: '🧪 TEST NOTIFICATION',
            message: 'Ceci est une notification de test. Si vous la voyez, ça marche!',
            createdAt: new Date()
        };
        
        // Émettre via Socket.IO
        const io = req.app.get('io');
        if (io) {
            io.to(userId).emit('new_notification', notification);
            console.log('✅ Notification émise vers room:', userId);
            
            res.json({
                success: true,
                message: 'Notification envoyée',
                notification
            });
        } else {
            console.error('❌ IO non disponible');
            res.status(500).json({
                success: false,
                message: 'Socket.IO non disponible'
            });
        }
    } catch (error) {
        console.error('❌ Erreur:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
