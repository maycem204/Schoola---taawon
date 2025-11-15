require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const User = require('./models/User');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schoola-taawon';

async function debugUnread() {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connecté à MongoDB\n');
        
        // Trouver les utilisateurs
        const eya = await User.findOne({ username: 'eya' });
        const yasmine = await User.findOne({ username: 'yasmine' });
        
        console.log('👤 Eya ID:', eya._id.toString());
        console.log('👤 Yasmine ID:', yasmine._id.toString());
        console.log('');
        
        // Trouver la conversation entre eya et yasmine
        const conv = await Conversation.findOne({
            participants: { $all: [eya._id, yasmine._id] }
        })
        .populate({
            path: 'lastMessage',
            populate: {
                path: 'sender',
                select: 'username _id'
            }
        });
        
        if (!conv) {
            console.log('❌ Aucune conversation trouvée entre eya et yasmine');
            process.exit(1);
        }
        
        console.log('📬 Conversation trouvée:', conv._id);
        console.log('');
        
        if (conv.lastMessage) {
            const msg = conv.lastMessage;
            console.log('💬 Dernier message:');
            console.log('   Contenu:', msg.content);
            console.log('   Sender._id:', msg.sender._id.toString());
            console.log('   Sender.username:', msg.sender.username);
            console.log('   readBy:', msg.readBy.map(id => id.toString()));
            console.log('');
            
            // Vérifications
            const isFromEya = msg.sender._id.toString() === eya._id.toString();
            const eyaHasRead = msg.readBy.some(id => id.toString() === eya._id.toString());
            
            console.log('🔍 VÉRIFICATIONS POUR EYA:');
            console.log('   Message envoyé par eya?', isFromEya);
            console.log('   Message lu par eya?', eyaHasRead);
            console.log('');
            
            if (!isFromEya && !eyaHasRead) {
                console.log('✅ CE MESSAGE DEVRAIT AVOIR LE FOND BLEU POUR EYA!');
            } else {
                console.log('❌ Ce message ne devrait PAS avoir le fond bleu pour eya');
                if (isFromEya) console.log('   Raison: Message envoyé par eya elle-même');
                if (eyaHasRead) console.log('   Raison: Message déjà lu par eya');
            }
        }
        
        // Vérifier tous les messages non lus pour eya
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        const unreadMessages = await Message.find({
            conversation: conv._id,
            sender: { $ne: eya._id },
            readBy: { $ne: eya._id }
        }).populate('sender', 'username');
        
        console.log(`📊 Messages non lus dans cette conversation pour eya: ${unreadMessages.length}`);
        
        if (unreadMessages.length > 0) {
            console.log('\n📨 Détails des messages non lus:');
            unreadMessages.forEach((msg, i) => {
                console.log(`\n   ${i + 1}. "${msg.content}"`);
                console.log(`      De: ${msg.sender.username}`);
                console.log(`      Date: ${msg.createdAt}`);
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

debugUnread();
