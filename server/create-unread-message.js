require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const User = require('./models/User');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schoola-taawon';

async function createUnreadMessage() {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connecté à MongoDB\n');
        
        // Trouver les utilisateurs
        const eya = await User.findOne({ username: 'eya' });
        const yasmine = await User.findOne({ username: 'yasmine' });
        
        if (!eya || !yasmine) {
            console.log('❌ Utilisateurs non trouvés');
            process.exit(1);
        }
        
        console.log('👤 Eya ID:', eya._id.toString());
        console.log('👤 Yasmine ID:', yasmine._id.toString());
        console.log('');
        
        // Trouver ou créer une conversation
        let conv = await Conversation.findOne({
            participants: { $all: [eya._id, yasmine._id] }
        });
        
        if (!conv) {
            conv = new Conversation({
                participants: [eya._id, yasmine._id]
            });
            await conv.save();
            console.log('✅ Nouvelle conversation créée');
        } else {
            console.log('✅ Conversation existante trouvée');
        }
        
        // Créer un message de yasmine vers eya (NON LU)
        const message = new Message({
            conversation: conv._id,
            sender: yasmine._id,
            content: '🔵 TEST MESSAGE NON LU - Si tu vois ce message avec un fond bleu, ça marche!',
            readBy: [] // VIDE = non lu par personne
        });
        
        await message.save();
        console.log('✅ Message créé (non lu)');
        console.log('');
        
        // Mettre à jour le lastMessage de la conversation
        conv.lastMessage = message._id;
        await conv.save();
        console.log('✅ Conversation mise à jour');
        console.log('');
        
        // Vérifier
        const updatedConv = await Conversation.findById(conv._id)
            .populate({
                path: 'lastMessage',
                populate: {
                    path: 'sender',
                    select: 'username'
                }
            });
        
        console.log('📊 VÉRIFICATION:');
        console.log('   Conversation ID:', updatedConv._id);
        console.log('   Dernier message:', updatedConv.lastMessage.content);
        console.log('   Envoyé par:', updatedConv.lastMessage.sender.username);
        console.log('   readBy:', updatedConv.lastMessage.readBy);
        console.log('   readBy.length:', updatedConv.lastMessage.readBy.length);
        console.log('');
        
        const eyaHasRead = updatedConv.lastMessage.readBy.some(id => id.toString() === eya._id.toString());
        console.log('✅ Eya a lu ce message?', eyaHasRead);
        console.log('');
        
        if (!eyaHasRead) {
            console.log('🎉 PARFAIT! Ce message devrait avoir le FOND BLEU pour eya!');
            console.log('');
            console.log('📱 MAINTENANT:');
            console.log('   1. Connectez-vous avec eya (eyamanaa3@gmail.com)');
            console.log('   2. Allez dans Messages');
            console.log('   3. La conversation avec yasmine devrait avoir un FOND BLEU');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

createUnreadMessage();
