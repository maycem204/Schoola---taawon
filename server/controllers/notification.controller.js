const Notification = require('../models/Notification');

// Obtenir toutes les notifications de l'utilisateur
exports.getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        const notifications = await Notification.find({
            recipient: req.user.userId
        })
        .populate('sender', 'username profilePicture')
        .populate('relatedListing', 'title images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

        const totalNotifications = await Notification.countDocuments({
            recipient: req.user.userId
        });

        const unreadCount = await Notification.countDocuments({
            recipient: req.user.userId,
            isRead: false
        });

        res.json({
            notifications,
            totalNotifications,
            unreadCount,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalNotifications / limit)
        });
    } catch (error) {
        console.error('Erreur get notifications:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Marquer une notification comme lue
exports.markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findOneAndUpdate(
            {
                _id: notificationId,
                recipient: req.user.userId
            },
            {
                isRead: true,
                readAt: new Date()
            },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification non trouvée' });
        }

        res.json(notification);
    } catch (error) {
        console.error('Erreur mark as read:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Marquer toutes les notifications comme lues
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                recipient: req.user.userId,
                isRead: false
            },
            {
                isRead: true,
                readAt: new Date()
            }
        );

        res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
    } catch (error) {
        console.error('Erreur mark all as read:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer une notification
exports.deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;

        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            recipient: req.user.userId
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification non trouvée' });
        }

        res.json({ message: 'Notification supprimée' });
    } catch (error) {
        console.error('Erreur delete notification:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
