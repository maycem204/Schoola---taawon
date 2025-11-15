require('dotenv').config();
const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const User = require('./models/User');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schoola-taawon';

async function checkNotifications() {
    try {
        await mongoose.connect(mongoUri);
        console.log('✅ Connecté à MongoDB\n');
        
        const eya = await User.findOne({ username: 'eya' });
        if (!eya) {
            console.log('❌ Utilisateur eya non trouvé');
            process.exit(1);
        }
        
        console.log('👤 Eya ID:', eya._id.toString());
        
        // Chercher TOUTES les notifications pour eya
        const notifications = await Notification.find({ recipient: eya._id })
            .populate('sender', 'username')
            .sort({ createdAt: -1 });
        
        console.log(`\n📬 ${notifications.length} notification(s) trouvée(s) pour eya:\n`);
        
        if (notifications.length === 0) {
            console.log('❌ AUCUNE notification dans la base de données!');
            console.log('   Le problème: Les notifications ne sont PAS créées quand quelqu\'un like.');
            console.log('\n💡 Solution: Le contrôleur de likes ne fonctionne pas correctement.');
        } else {
            notifications.forEach((notif, i) => {
                console.log(`${i + 1}. ${notif.title}`);
                console.log(`   Message: ${notif.message}`);
                console.log(`   Type: ${notif.type}`);
                console.log(`   De: ${notif.sender.username}`);
                console.log(`   Lu: ${notif.isRead}`);
                console.log(`   Date: ${notif.createdAt}`);
                console.log('');
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

checkNotifications();
