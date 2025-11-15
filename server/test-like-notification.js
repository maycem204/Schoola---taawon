require('dotenv').config();
const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const User = require('./models/User');
const Listing = require('./models/Listing');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schoola-taawon';

async function testLikeNotification() {
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
        
        // Trouver une annonce d'eya
        const eyaListing = await Listing.findOne({ owner: eya._id });
        
        if (!eyaListing) {
            console.log('❌ Aucune annonce trouvée pour eya');
            process.exit(1);
        }
        
        console.log('📋 Annonce:', eyaListing.title);
        console.log('');
        
        // Créer une notification de like
        const notification = new Notification({
            recipient: eya._id,
            sender: yasmine._id,
            type: 'like',
            title: '❤️ Quelqu\'un a aimé votre annonce',
            message: `Votre annonce "${eyaListing.title}" a reçu un nouveau like !`,
            relatedListing: eyaListing._id
        });
        
        await notification.save();
        
        console.log('✅ Notification créée dans la base de données');
        console.log('');
        console.log('📊 Détails de la notification:');
        console.log('   ID:', notification._id);
        console.log('   Destinataire:', notification.recipient);
        console.log('   Type:', notification.type);
        console.log('   Titre:', notification.title);
        console.log('   Message:', notification.message);
        console.log('   isRead:', notification.isRead);
        console.log('');
        
        // Vérifier toutes les notifications d'eya
        const allNotifications = await Notification.find({ recipient: eya._id })
            .populate('sender', 'username')
            .sort({ createdAt: -1 });
        
        console.log(`📬 Total notifications pour eya: ${allNotifications.length}`);
        allNotifications.forEach((notif, i) => {
            console.log(`\n   ${i + 1}. ${notif.title}`);
            console.log(`      Message: ${notif.message}`);
            console.log(`      De: ${notif.sender.username}`);
            console.log(`      Lu: ${notif.isRead}`);
            console.log(`      Date: ${notif.createdAt}`);
        });
        
        console.log('\n✅ Notification créée! Rafraîchissez la page et cliquez sur la cloche 🔔');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

testLikeNotification();
