require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Listing = require('./models/Listing');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schoola-taawon';

async function ensureEyaListing() {
    try {
        await mongoose.connect(mongoUri);
        console.log('✅ Connecté à MongoDB\n');
        
        const eya = await User.findOne({ username: 'eya' });
        if (!eya) {
            console.log('❌ Utilisateur eya non trouvé');
            process.exit(1);
        }
        
        console.log('👤 Eya ID:', eya._id.toString());
        
        // Trouver les annonces d'eya
        const eyaListings = await Listing.find({ owner: eya._id });
        console.log(`📋 Eya a ${eyaListings.length} annonce(s)\n`);
        
        if (eyaListings.length > 0) {
            console.log('✅ Annonces d\'eya:');
            eyaListings.forEach((listing, i) => {
                console.log(`   ${i + 1}. "${listing.title}" (ID: ${listing._id})`);
            });
            console.log('\n✅ Yasmine peut liker ces annonces pour tester!');
            console.log(`\n🔗 URL: http://localhost:3000/listings/${eyaListings[0]._id}`);
        } else {
            console.log('⚠️  Eya n\'a pas d\'annonces!');
            console.log('   Connectez-vous avec eya et créez une annonce d\'abord.');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

ensureEyaListing();
