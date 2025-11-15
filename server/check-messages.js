require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const User = require('./models/User');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schoola-taawon';

async function checkMessages() {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connecté à MongoDB\n');
        
        // Trouver l'utilisateur "eya"
        const eyaUser = await User.findOne({ username: 'eya' });
        
        if (!eyaUser) {
            console.log('❌ Utilisateur "eya" non trouvé');
            process.exit(1);
        }
        
        console.log(`👤 Utilisateur: ${eyaUser.username} (${eyaUser._id})\n`);
        
        // Trouver toutes les conversations
        const conversations = await Conversation.find({
            participants: eyaUser._id
        })
        .populate('participants', 'username')
        .populate({
            path: 'lastMessage',
            populate: {
                path: 'sender',
                select: 'username'
            }
        });
        
        console.log(`📨 ${conversations.length} conversation(s) trouvée(s)\n`);
        
        for (const conv of conversations) {
            console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`📬 Conversation: ${conv._id}`);
            console.log(`👥 Participants: ${conv.participants.map(p => p.username).join(', ')}`);
            
            if (conv.lastMessage) {
                const lastMsg = conv.lastMessage;
                console.log(`\n💬 Dernier message:`);
                console.log(`   Contenu: "${lastMsg.content}"`);
                console.log(`   Envoyé par: ${lastMsg.sender.username} (${lastMsg.sender._id})`);
                console.log(`   Lu par: ${lastMsg.readBy.length} personne(s)`);
                console.log(`   IDs readBy:`, lastMsg.readBy.map(id => id.toString()));
                
                // Vérifier si eya l'a lu
                const eyaHasRead = lastMsg.readBy.some(id => id.toString() === eyaUser._id.toString());
                const isFromEya = lastMsg.sender._id.toString() === eyaUser._id.toString();
                
                console.log(`\n   ✓ Message de eya? ${isFromEya ? 'OUI' : 'NON'}`);
                console.log(`   ✓ Lu par eya? ${eyaHasRead ? 'OUI' : 'NON'}`);
                
                if (!isFromEya && !eyaHasRead) {
                    console.log(`   🔵 DEVRAIT AVOIR FOND BLEU!`);
                } else {
                    console.log(`   ⚪ Pas de fond bleu (normal)`);
                }
            } else {
                console.log(`\n   Aucun message dans cette conversation`);
            }
            
            // Compter tous les messages non lus de cette conversation
            const unreadMessages = await Message.find({
                conversation: conv._id,
                sender: { $ne: eyaUser._id },
                readBy: { $ne: eyaUser._id }
            });
            
            console.log(`\n   📊 Messages non lus: ${unreadMessages.length}`);
        }
        
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
        
        // Compter le total de messages non lus
        const totalUnread = await Message.countDocuments({
            sender: { $ne: eyaUser._id },
            readBy: { $ne: eyaUser._id }
        });
        
        console.log(`\n📊 RÉSUMÉ:`);
        console.log(`   Total messages non lus: ${totalUnread}`);
        console.log(`   Total conversations: ${conversations.length}`);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

checkMessages();
