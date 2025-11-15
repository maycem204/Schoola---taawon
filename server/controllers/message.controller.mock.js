// Contrôleur de messagerie mock pour les tests
const mockData = require('../mockData');

// Ajouter des structures pour les conversations et messages
if (!mockData.conversations) mockData.conversations = [];
if (!mockData.messages) mockData.messages = [];

exports.getConversations = async (req, res) => {
    try {
        console.log('📋 Récupération conversations pour:', req.user.username);
        
        // Filtrer les conversations de l'utilisateur
        const userConversations = mockData.conversations.filter(conv => 
            conv.participants.includes(req.user.userId)
        );
        
        // Peupler les participants avec des données utilisateur et calculer les messages non lus
        const populatedConversations = userConversations.map(conv => {
            // Trouver le dernier message de cette conversation
            const lastMessage = mockData.messages
                .filter(msg => msg.conversation === conv._id)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
            
            // Vérifier si l'utilisateur actuel a lu le dernier message
            const hasUnreadMessages = lastMessage && 
                lastMessage.sender !== req.user.userId && 
                !lastMessage.readBy.includes(req.user.userId);
            
            return {
                ...conv,
                participants: conv.participants.map(participantId => {
                // Trouver l'utilisateur réel
                const user = mockData.users.find(u => u._id === participantId);
                return {
                    _id: participantId,
                    username: user ? user.username : 'Utilisateur',
                    profilePicture: ''
                };
            }),
                listing: conv.listing ? mockData.listings.find(l => l._id === conv.listing) : null,
                lastMessage: lastMessage,
                hasUnreadMessages: hasUnreadMessages
            };
        });
        
        res.json(populatedConversations);
    } catch (error) {
        console.error('❌ Erreur getConversations:', error);
        res.status(500).json({
            message: "Erreur lors de la récupération des conversations",
            error: error.message
        });
    }
};

exports.startConversation = async (req, res) => {
    try {
        const { listingId, recipientId } = req.body;
        console.log('💬 Démarrage conversation:', req.user.username, '→', recipientId);
        
        // Vérifier si une conversation existe déjà
        let conversation = mockData.conversations.find(conv => 
            conv.listing === listingId && 
            conv.participants.includes(req.user.userId) &&
            conv.participants.includes(recipientId)
        );
        
        if (!conversation) {
            // Créer une nouvelle conversation
            conversation = {
                _id: Date.now().toString(),
                participants: [req.user.userId, recipientId],
                listing: listingId,
                lastMessage: null,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            mockData.conversations.push(conversation);
        }
        
        // Peupler la conversation avant de la retourner
        const populatedConversation = {
            ...conversation,
            participants: conversation.participants.map(participantId => {
                let username = 'utilisateur';
                if (participantId === '1') username = 'testuser';
                else if (participantId === '2') username = 'autreuser';
                else if (participantId.startsWith('user_')) username = participantId;
                else username = participantId;
                
                return {
                    _id: participantId,
                    username: username,
                    profilePicture: ''
                };
            }),
            listing: conversation.listing ? mockData.listings.find(l => l._id === conversation.listing) : null
        };
        
        console.log('✅ Conversation créée/trouvée:', conversation._id);
        res.status(201).json(populatedConversation);
    } catch (error) {
        console.error('❌ Erreur startConversation:', error);
        res.status(500).json({
            message: "Erreur lors du démarrage de la conversation",
            error: error.message
        });
    }
};

exports.getConversationMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        console.log('📨 Récupération messages pour conversation:', conversationId);
        
        // Filtrer les messages de cette conversation
        const messages = mockData.messages.filter(msg => 
            msg.conversation === conversationId
        );
        
        res.json(messages);
    } catch (error) {
        console.error('❌ Erreur getConversationMessages:', error);
        res.status(500).json({
            message: "Erreur lors de la récupération des messages",
            error: error.message
        });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { conversationId, content } = req.body;
        console.log('📤 Envoi message de:', req.user.username);
        
        // Créer le nouveau message
        const message = {
            _id: Date.now().toString(),
            conversation: conversationId,
            sender: req.user.userId,
            content: content,
            readBy: [req.user.userId],
            createdAt: new Date()
        };
        
        mockData.messages.push(message);
        
        // Mettre à jour la conversation avec le message complet
        const conversation = mockData.conversations.find(c => c._id === conversationId);
        if (conversation) {
            conversation.lastMessage = message;
            conversation.updatedAt = new Date();
        }
        
        // Simuler la population du sender
        const populatedMessage = {
            ...message,
            sender: {
                _id: req.user.userId,
                username: req.user.username,
                profilePicture: ''
            }
        };
        
        console.log('✅ Message envoyé');
        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error('❌ Erreur sendMessage:', error);
        res.status(500).json({
            message: "Erreur lors de l'envoi du message",
            error: error.message
        });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        console.log('🔵 Marquer comme lu:', conversationId, 'par', req.user.username);
        
        let markedCount = 0;
        
        // Marquer tous les messages de cette conversation comme lus par cet utilisateur
        mockData.messages.forEach(message => {
            if (message.conversation === conversationId && 
                message.sender !== req.user.userId && // Ne pas marquer ses propres messages
                !message.readBy.includes(req.user.userId)) {
                message.readBy.push(req.user.userId);
                markedCount++;
            }
        });
        
        console.log(`✅ ${markedCount} message(s) marqué(s) comme lu(s)`);
        res.json({ 
            message: 'Messages marqués comme lus',
            markedCount: markedCount
        });
    } catch (error) {
        console.error('❌ Erreur markAsRead:', error);
        res.status(500).json({
            message: "Erreur lors du marquage comme lu",
            error: error.message
        });
    }
};
