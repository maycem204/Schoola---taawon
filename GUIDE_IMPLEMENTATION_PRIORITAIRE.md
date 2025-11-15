# 🚀 Guide d'Implémentation Prioritaire

## 📋 Table des Matières
1. [Double Coche de Lecture](#1-double-coche-de-lecture)
2. [Indicateur "En train d'écrire"](#2-indicateur-en-train-décrire)
3. [Prévisualisation Dernier Message](#3-prévisualisation-dernier-message)
4. [Séparateurs de Date](#4-séparateurs-de-date)
5. [Compteur Global Non Lus](#5-compteur-global-messages-non-lus)

---

## 1. Double Coche de Lecture ✅

### Objectif
Afficher un indicateur visuel (comme WhatsApp/Messenger) pour savoir si un message a été lu.

### Modifications Backend

#### 1.1 Mettre à jour le modèle Message
```javascript
// server/models/Message.js
const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // NOUVEAU : Statut du message
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    deliveredAt: Date,
    readAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
```

#### 1.2 Mettre à jour le contrôleur markAsRead
```javascript
// server/controllers/message.controller.js
exports.markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;

        // Marquer les messages comme lus ET mettre à jour le statut
        const result = await Message.updateMany(
            {
                conversation: conversationId,
                sender: { $ne: req.user.userId },
                readBy: { $ne: req.user.userId }
            },
            {
                $addToSet: { readBy: req.user.userId },
                $set: { 
                    status: 'read',
                    readAt: new Date()
                }
            }
        );

        // Émettre un événement pour mettre à jour en temps réel
        req.app.get('io').to(conversationId).emit('messages_read', {
            conversationId,
            readerId: req.user.userId,
            readAt: new Date()
        });

        res.json({ 
            message: "Messages marqués comme lus",
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors du marquage des messages comme lus",
            error: error.message
        });
    }
};
```

### Modifications Frontend

#### 1.3 Créer un composant MessageStatus
```typescript
// client/src/components/MessageStatus.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface MessageStatusProps {
  status: 'sent' | 'delivered' | 'read';
  isRead: boolean;
  createdAt: string;
}

const MessageStatus: React.FC<MessageStatusProps> = ({ status, isRead, createdAt }) => {
  const getStatusIcon = () => {
    if (isRead) {
      return <DoneAllIcon sx={{ fontSize: 14, color: '#667eea' }} />;
    } else if (status === 'delivered') {
      return <DoneAllIcon sx={{ fontSize: 14, color: 'grey.500' }} />;
    } else if (status === 'sent') {
      return <DoneIcon sx={{ fontSize: 14, color: 'grey.500' }} />;
    } else {
      return <AccessTimeIcon sx={{ fontSize: 14, color: 'grey.400' }} />;
    }
  };

  const getStatusText = () => {
    if (isRead) return 'Lu';
    if (status === 'delivered') return 'Remis';
    if (status === 'sent') return 'Envoyé';
    return 'En attente';
  };

  const getStatusColor = () => {
    return isRead ? '#667eea' : 'grey.500';
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 0.5,
      mt: 0.5
    }}>
      {getStatusIcon()}
      <Typography 
        variant="caption" 
        sx={{ color: getStatusColor(), fontSize: 10 }}
      >
        {getStatusText()} • {new Date(createdAt).toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </Typography>
    </Box>
  );
};

export default MessageStatus;
```

#### 1.4 Intégrer dans Messages.tsx
```typescript
// client/src/pages/Messages.tsx
import MessageStatus from '../components/MessageStatus';

// Dans le rendu des messages (autour de la ligne 407)
{messages.map((message) => {
  const isSentByMe = message.sender._id === user?.id;
  const isRead = message.readBy?.length > 1; // Plus d'un utilisateur = lu par le destinataire
  
  return (
    <Box
      key={message._id}
      sx={{
        display: 'flex',
        justifyContent: isSentByMe ? 'flex-end' : 'flex-start',
        mb: 1
      }}
    >
      <Box
        sx={{
          maxWidth: '70%',
          backgroundColor: isSentByMe ? 'primary.main' : 'grey.200',
          color: isSentByMe ? 'white' : 'text.primary',
          borderRadius: 2,
          p: 1.5,
        }}
      >
        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
          {message.content}
        </Typography>
        
        {/* NOUVEAU : Statut du message pour l'expéditeur uniquement */}
        {isSentByMe && (
          <MessageStatus 
            status={message.status || 'sent'}
            isRead={isRead}
            createdAt={message.createdAt}
          />
        )}
        
        {/* Pour le destinataire, afficher juste l'heure */}
        {!isSentByMe && (
          <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
            {new Date(message.createdAt).toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Typography>
        )}
      </Box>
    </Box>
  );
})}
```

#### 1.5 Écouter l'événement messages_read
```typescript
// client/src/pages/Messages.tsx
// Dans le useEffect Socket.IO (autour de la ligne 97)
socket.on('messages_read', (data) => {
  console.log('Messages marqués comme lus:', data);
  
  // Mettre à jour l'interface pour refléter que les messages ont été lus
  setMessages(prev => prev.map(msg => {
    if (msg.conversation === data.conversationId && msg.sender._id === user?.id) {
      return {
        ...msg,
        status: 'read',
        readAt: data.readAt,
        readBy: [...(msg.readBy || []), data.readerId]
      };
    }
    return msg;
  }));
});
```

---

## 2. Indicateur "En train d'écrire" ⌨️

### Objectif
Afficher un indicateur lorsque l'autre utilisateur tape un message (comme Messenger).

### Modifications Backend

#### 2.1 Ajouter les événements Socket.IO
```javascript
// server/index.js
// Dans la section Socket.IO (après la ligne 50)
socket.on('typing', (data) => {
  console.log(`${data.username} est en train d'écrire dans ${data.conversationId}`);
  
  // Envoyer à l'autre utilisateur dans la conversation
  socket.to(data.conversationId).emit('user_typing', {
    userId: data.userId,
    username: data.username,
    conversationId: data.conversationId
  });
});

socket.on('stop_typing', (data) => {
  console.log(`${data.username} a arrêté d'écrire dans ${data.conversationId}`);
  
  socket.to(data.conversationId).emit('user_stop_typing', {
    userId: data.userId,
    conversationId: data.conversationId
  });
});
```

### Modifications Frontend

#### 2.2 Ajouter le state et les refs
```typescript
// client/src/pages/Messages.tsx
// Ajouter après la ligne 61
const [otherUserTyping, setOtherUserTyping] = useState(false);
const typingTimeoutRef = useRef<NodeJS.Timeout>();
```

#### 2.3 Écouter les événements typing
```typescript
// Dans le useEffect Socket.IO (après les autres socket.on)
socket.on('user_typing', (data) => {
  console.log(`${data.username} est en train d'écrire`);
  if (selectedConversation && data.conversationId === selectedConversation._id) {
    setOtherUserTyping(true);
  }
});

socket.on('user_stop_typing', (data) => {
  console.log(`Utilisateur a arrêté d'écrire`);
  if (selectedConversation && data.conversationId === selectedConversation._id) {
    setOtherUserTyping(false);
  }
});
```

#### 2.4 Émettre typing lors de la saisie
```typescript
// Modifier le TextField (autour de la ligne 451)
<TextField
  fullWidth
  size="small"
  placeholder="Tapez votre message..."
  value={newMessage}
  onChange={(e) => {
    setNewMessage(e.target.value);
    
    // NOUVEAU : Émettre l'événement typing
    if (socketRef.current && selectedConversation) {
      socketRef.current.emit('typing', {
        conversationId: selectedConversation._id,
        userId: user?.id,
        username: user?.username
      });
      
      // Arrêter l'indicateur après 2 secondes d'inactivité
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        if (socketRef.current && selectedConversation) {
          socketRef.current.emit('stop_typing', {
            conversationId: selectedConversation._id,
            userId: user?.id,
            username: user?.username
          });
        }
      }, 2000);
    }
  }}
  autoComplete="off"
/>
```

#### 2.5 Afficher l'indicateur
```typescript
// Juste avant le TextField, ajouter (autour de la ligne 440)
{otherUserTyping && (
  <Box 
    sx={{ 
      p: 1, 
      pl: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      bgcolor: 'grey.50'
    }}
  >
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        '& > div': {
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          animation: 'typing 1.4s infinite',
          '&:nth-of-type(2)': {
            animationDelay: '0.2s'
          },
          '&:nth-of-type(3)': {
            animationDelay: '0.4s'
          }
        }
      }}
    >
      <div />
      <div />
      <div />
    </Box>
    <Typography variant="caption" color="text.secondary" fontStyle="italic">
      {getOtherParticipant(selectedConversation)?.username} est en train d'écrire...
    </Typography>
  </Box>
)}

{/* Ajouter le style d'animation dans le sx global */}
<style>
{`
  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.7;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
`}
</style>
```

---

## 3. Prévisualisation Dernier Message 💬

### Objectif
Afficher le dernier message dans la liste des conversations (déjà partiellement implémenté).

### Modifications Frontend

#### 3.1 Améliorer l'affichage dans Messages.tsx
```typescript
// Modifier le ListItemText (autour de la ligne 341)
<ListItemText
  primary={
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography 
        variant="subtitle1"
        sx={{ 
          fontWeight: isUnread ? 'bold' : 'normal',
          color: isUnread ? 'primary.main' : 'text.primary'
        }}
      >
        {otherUser?.username}
      </Typography>
      {conv.lastMessage && (
        <Typography variant="caption" color="text.secondary">
          {formatMessageTime(conv.lastMessage.createdAt)}
        </Typography>
      )}
    </Box>
  }
  secondary={
    <Box>
      <Typography 
        variant="caption" 
        color="text.secondary"
        sx={{ display: 'block' }}
      >
        📚 {conv.listing?.title || 'Conversation'}
      </Typography>
      {conv.lastMessage && (
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: isUnread ? 600 : 400,
            color: isUnread ? 'primary.main' : 'text.secondary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mt: 0.5
          }}
        >
          {/* Icône si c'est moi qui ai envoyé */}
          {conv.lastMessage.sender._id === user?.id && (
            <DoneAllIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
          )}
          {/* Préfixe "Vous:" si c'est moi */}
          {conv.lastMessage.sender._id === user?.id && 'Vous: '}
          {/* Contenu du message (tronqué) */}
          {conv.lastMessage.content.length > 40 
            ? conv.lastMessage.content.substring(0, 40) + '...'
            : conv.lastMessage.content
          }
        </Typography>
      )}
    </Box>
  }
  primaryTypographyProps={{ component: 'div' }}
  secondaryTypographyProps={{ component: 'div' }}
/>
```

#### 3.2 Fonction formatMessageTime
```typescript
// Ajouter au début du composant Messages
const formatMessageTime = (date: string): string => {
  const messageDate = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - messageDate.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return messageDate.toLocaleDateString('fr-FR', { weekday: 'short' });
  return messageDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};
```

---

## 4. Séparateurs de Date 📅

### Objectif
Ajouter des séparateurs de date pour mieux organiser les messages.

### Modifications Frontend

#### 4.1 Créer une fonction de groupement
```typescript
// client/src/pages/Messages.tsx
// Ajouter cette fonction utilitaire
const formatDateSeparator = (date: string): string => {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const isToday = messageDate.toDateString() === today.toDateString();
  const isYesterday = messageDate.toDateString() === yesterday.toDateString();
  
  if (isToday) return 'Aujourd\'hui';
  if (isYesterday) return 'Hier';
  
  return messageDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
};
```

#### 4.2 Modifier le rendu des messages
```typescript
// Remplacer le rendu des messages (autour de la ligne 400)
{(() => {
  let lastDate: string | null = null;
  
  return messages.map((message, index) => {
    const messageDate = new Date(message.createdAt).toDateString();
    const showDateSeparator = messageDate !== lastDate;
    lastDate = messageDate;
    
    const isSentByMe = message.sender._id === user?.id;
    const isRead = message.readBy?.length > 1;
    
    return (
      <React.Fragment key={message._id}>
        {/* Séparateur de date */}
        {showDateSeparator && (
          <Box sx={{ 
            textAlign: 'center', 
            my: 2,
            position: 'relative'
          }}>
            <Divider sx={{ 
              '&::before, &::after': {
                borderColor: 'grey.300'
              }
            }}>
              <Chip 
                label={formatDateSeparator(message.createdAt)} 
                size="small"
                sx={{ 
                  bgcolor: 'grey.100',
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: '0.75rem'
                }}
              />
            </Divider>
          </Box>
        )}
        
        {/* Message */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: isSentByMe ? 'flex-end' : 'flex-start',
            mb: 1
          }}
        >
          <Box
            sx={{
              maxWidth: '70%',
              backgroundColor: isSentByMe ? 'primary.main' : 'grey.200',
              color: isSentByMe ? 'white' : 'text.primary',
              borderRadius: 2,
              p: 1.5,
            }}
          >
            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
              {message.content}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
              {new Date(message.createdAt).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Typography>
          </Box>
        </Box>
      </React.Fragment>
    );
  });
})()}
```

#### 4.3 Importer Divider et Chip
```typescript
// Ajouter au début de Messages.tsx (ligne 2)
import { 
  // ... existant
  Divider,
  Chip
} from '@mui/material';
```

---

## 5. Compteur Global Messages Non Lus 🔴

### Objectif
Afficher un badge avec le nombre de messages non lus dans la navbar.

### Modifications Backend

#### 5.1 Créer une nouvelle API
```javascript
// server/controllers/message.controller.js
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
```

#### 5.2 Ajouter la route
```javascript
// server/routes/messages.js
router.get('/unread-count', auth, messageController.getUnreadCount);
```

### Modifications Frontend

#### 5.3 Créer le service
```typescript
// client/src/services/message.service.ts
async getUnreadCount() {
    const response = await axios.get(`${API_URL}/messages/unread-count`, {
        headers: {
            'Authorization': `Bearer ${authService.getToken()}`
        }
    });
    return response.data.unreadCount;
}
```

#### 5.4 Intégrer dans la Navbar
```typescript
// client/src/components/Navbar.tsx
import { Badge } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import messageService from '../services/message.service';

// Ajouter dans le composant
const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
  const loadUnreadCount = async () => {
    if (!isAuthenticated) return;
    
    try {
      const count = await messageService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Erreur comptage messages:', error);
    }
  };
  
  loadUnreadCount();
  
  // Recharger toutes les 30 secondes
  const interval = setInterval(loadUnreadCount, 30000);
  return () => clearInterval(interval);
}, [isAuthenticated]);

// Dans le JSX
<IconButton 
  color="inherit" 
  onClick={() => navigate('/messages')}
>
  <Badge 
    badgeContent={unreadCount} 
    color="error"
    max={99}
  >
    <ChatIcon />
  </Badge>
</IconButton>
```

#### 5.5 Mettre à jour en temps réel avec Socket.IO
```typescript
// Dans le useEffect Socket.IO de Messages.tsx
// Émettre un événement quand un message est lu
socket.on('messages_read', (data) => {
  // Informer la navbar de mettre à jour le compteur
  window.dispatchEvent(new CustomEvent('unread_count_changed'));
});

// Dans Navbar.tsx
useEffect(() => {
  const handleUnreadCountChange = () => {
    loadUnreadCount();
  };
  
  window.addEventListener('unread_count_changed', handleUnreadCountChange);
  return () => window.removeEventListener('unread_count_changed', handleUnreadCountChange);
}, []);
```

---

## 🧪 Tests à Effectuer

### Pour chaque fonctionnalité

#### Double Coche
- [ ] Envoyer un message
- [ ] Vérifier qu'il affiche une seule coche (envoyé)
- [ ] Ouvrir la conversation en tant que destinataire
- [ ] Vérifier que la double coche apparaît en bleu (lu)

#### Indicateur Typing
- [ ] Ouvrir une conversation
- [ ] Taper un message (ne pas envoyer)
- [ ] Vérifier que l'autre utilisateur voit "en train d'écrire"
- [ ] Arrêter de taper pendant 2 secondes
- [ ] Vérifier que l'indicateur disparaît

#### Prévisualisation
- [ ] Envoyer un message dans une conversation
- [ ] Vérifier qu'il apparaît dans la liste
- [ ] Vérifier que "Vous: " s'affiche si c'est vous
- [ ] Vérifier la troncature si le message est long

#### Séparateurs
- [ ] Envoyer des messages à des dates différentes
- [ ] Vérifier les séparateurs "Aujourd'hui", "Hier", dates
- [ ] Vérifier qu'ils n'apparaissent qu'une fois par jour

#### Compteur
- [ ] Recevoir un nouveau message
- [ ] Vérifier que le badge s'incrémente
- [ ] Lire le message
- [ ] Vérifier que le badge se décrémente

---

## 🚀 Ordre d'Implémentation

1. **Séparateurs de date** (le plus simple, impact visuel immédiat)
2. **Prévisualisation dernier message** (amélioration UX importante)
3. **Double coche de lecture** (feedback visuel essentiel)
4. **Indicateur typing** (interactivité temps réel)
5. **Compteur global** (visibilité globale)

---

## 📝 Checklist Finale

- [ ] Toutes les fonctionnalités testées individuellement
- [ ] Tests d'intégration effectués
- [ ] Pas de console.errors dans le navigateur
- [ ] Pas d'erreurs dans les logs serveur
- [ ] Testée sur plusieurs navigateurs
- [ ] Testée avec plusieurs utilisateurs simultanés
- [ ] Documentation mise à jour

---

**Prêt à implémenter ? Je peux commencer par la fonctionnalité de votre choix ! 🚀**
