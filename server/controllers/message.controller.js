const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

exports.getConversations = async (req, res) => {
    try {
        console.log('Récupération conversations pour utilisateur:', req.user.userId);
        
        const conversations = await Conversation.find({
            participants: req.user.userId
        })
        .populate('participants', 'username profilePicture')
        .populate('listing', 'title')
        .populate({
            path: 'lastMessage',
            populate: {
                path: 'sender',
                select: 'username profilePicture'
            }
        })
        .sort('-updatedAt');

        // Éliminer les duplicatas basés sur participants + listing
        const uniqueConversations = [];
        const seen = new Set();
        
        for (const conv of conversations) {
            // Créer une clé unique basée sur les participants triés + listing
            const participantIds = conv.participants.map(p => p._id.toString()).sort().join('-');
            const listingId = conv.listing?._id?.toString() || 'no-listing';
            const key = `${participantIds}-${listingId}`;
            
            if (!seen.has(key)) {
                seen.add(key);
                uniqueConversations.push(conv);
            }
        }

        // Transformer les participants et lastMessage pour ajouter id
        const conversationsWithId = uniqueConversations.map(conv => {
            const convObj = conv.toObject ? conv.toObject() : conv;
            if (convObj.participants) {
                convObj.participants = convObj.participants.map(p => ({
                    ...p,
                    id: p._id?.toString()
                }));
            }
            // Transformer aussi le sender du lastMessage
            if (convObj.lastMessage && convObj.lastMessage.sender) {
                convObj.lastMessage.sender = {
                    ...convObj.lastMessage.sender,
                    id: convObj.lastMessage.sender._id?.toString()
                };
            }
            return convObj;
        });

        console.log(`${uniqueConversations.length} conversation(s) unique(s) sur ${conversations.length} totales`);
        res.json(conversationsWithId);
    } catch (error) {
        console.error('Erreur getConversations:', error);
        res.status(500).json({
            message: "Erreur lors de la récupération des conversations",
            error: error.message
        });
    }
};

exports.getConversationMessages = async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params.conversationId);
        
        if (!conversation) {
            return res.status(404).json({
                message: "Conversation non trouvée"
            });
        }

        if (!conversation.participants.includes(req.user.userId)) {
            return res.status(403).json({
                message: "Vous n'êtes pas autorisé à accéder à cette conversation"
            });
        }

        const messages = await Message.find({
            conversation: req.params.conversationId
        })
        .populate('sender', 'username profilePicture')
        .sort('createdAt');

        res.json(messages);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des messages",
            error: error.message
        });
    }
};

exports.startConversation = async (req, res) => {
    try {
        const { recipientId, listingId } = req.body;

        // Vérifier si une conversation existe déjà
        const existingConversation = await Conversation.findOne({
            participants: { $all: [req.user.userId, recipientId] },
            listing: listingId
        });

        if (existingConversation) {
            const convObj = existingConversation.toObject();
            if (convObj.participants) {
                convObj.participants = convObj.participants.map(p => ({
                    ...p,
                    id: p._id?.toString()
                }));
            }
            return res.json(convObj);
        }

        const conversation = new Conversation({
            participants: [req.user.userId, recipientId],
            listing: listingId
        });

        await conversation.save();

        const populatedConversation = await Conversation.findById(conversation._id)
            .populate('participants', 'username profilePicture')
            .populate('listing', 'title');

        const convObj = populatedConversation.toObject();
        if (convObj.participants) {
            convObj.participants = convObj.participants.map(p => ({
                ...p,
                id: p._id?.toString()
            }));
        }

        res.status(201).json(convObj);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la création de la conversation",
            error: error.message
        });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { conversationId, content } = req.body;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({
                message: "Conversation non trouvée"
            });
        }

        if (!conversation.participants.includes(req.user.userId)) {
            return res.status(403).json({
                message: "Vous n'êtes pas autorisé à envoyer des messages dans cette conversation"
            });
        }

        const message = new Message({
            conversation: conversationId,
            sender: req.user.userId,
            content,
            readBy: [req.user.userId]
        });

        await message.save();

        // Mettre à jour le dernier message de la conversation
        conversation.lastMessage = message._id;
        await conversation.save();

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'username profilePicture');

        // Transformer le message pour ajouter id au sender
        const messageObj = populatedMessage.toObject();
        if (messageObj.sender && messageObj.sender._id) {
            messageObj.sender.id = messageObj.sender._id.toString();
        }

        // Émettre l'événement via Socket.IO
        req.app.get('io').to(conversationId).emit('new_message', messageObj);

        // Créer une notification pour le destinataire
        const Notification = require('../models/Notification');
        const otherParticipant = conversation.participants.find(
            p => p.toString() !== req.user.userId
        );

        // NOTIFICATIONS DE MESSAGES DÉSACTIVÉES
        // if (otherParticipant) {
        //     const User = require('../models/User');
        //     const sender = await User.findById(req.user.userId).select('username');
        //     const senderName = sender?.username || req.user.username || 'Un utilisateur';
        //     
        //     const notification = new Notification({
        //         recipient: otherParticipant,
        //         sender: req.user.userId,
        //         type: 'message',
        //         title: '💬 Nouveau message',
        //         message: `Vous avez reçu un nouveau message de ${senderName}`,
        //         relatedMessage: message._id
        //     });
        //     await notification.save();
        //     req.app.get('io').to(otherParticipant.toString()).emit('new_notification', notification);
        // }

        res.status(201).json(messageObj);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de l'envoi du message",
            error: error.message
        });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;

        await Message.updateMany(
            {
                conversation: conversationId,
                sender: { $ne: req.user.userId },
                readBy: { $ne: req.user.userId }
            },
            {
                $addToSet: { readBy: req.user.userId }
            }
        );

        res.json({ message: "Messages marqués comme lus" });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors du marquage des messages comme lus",
            error: error.message
        });
    }
};

exports.getUnreadCount = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user.userId
        })
        .populate({
            path: 'lastMessage',
            populate: {
                path: 'sender readBy',
                select: 'username'
            }
        });
        
        // Compter les conversations avec des messages non lus
        let unreadCount = 0;
        for (const conv of conversations) {
            if (conv.lastMessage) {
                const lastMsg = conv.lastMessage;
                // Si le dernier message n'est pas de moi ET je ne l'ai pas lu
                if (lastMsg.sender.toString() !== req.user.userId && 
                    !lastMsg.readBy.includes(req.user.userId)) {
                    unreadCount++;
                }
            }
        }
        
        res.json({ unreadCount });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors du comptage des messages non lus",
            error: error.message
        });
    }
};