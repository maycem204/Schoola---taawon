require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/Listing');
const User = require('./models/User');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schoola-taawon';

async function checkListings() {
    try {
        await mongoose.connect(mongoUri);
        console.log('✅ Connecté à MongoDB\n');
        
        const eya = await User.findOne({ username: 'eya' });
        const yasmine = await User.findOne({ username: 'yasmine' });
        
        if (!eya || !yasmine) {
            console.log('❌ Utilisateurs non trouvés');
            process.exit(1);
        }
        
        console.log('👤 Eya ID:', eya._id.toString());
        console.log('👤 Yasmine ID:', yasmine._id.toString());
        console.log('');
        
        // Annonces d'eya
        const eyaListings = await Listing.find({ owner: eya._id });
        console.log(`📋 Annonces d'eya: ${eyaListings.length}`);
        eyaListings.forEach((listing, i) => {
            console.log(`\n   ${i + 1}. "${listing.title}"`);
            console.log(`      ID: ${listing._id}`);
            console.log(`      Likes: ${listing.likesCount}`);
            console.log(`      Liké par: ${listing.likes.map(id => id.toString())}`);
        });
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // Annonces de yasmine  
        const yasmineListings = await Listing.find({ owner: yasmine._id });
        console.log(`📋 Annonces de yasmine: ${yasmineListings.length}`);
        yasmineListings.forEach((listing, i) => {
            console.log(`\n   ${i + 1}. "${listing.title}"`);
            console.log(`      ID: ${listing._id}`);
            console.log(`      Likes: ${listing.likesCount}`);
        });
        
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        
        // Vérifier si yasmine a liké une annonce d'eya
        const yasmineId = yasmine._id.toString();
        const eyaListingsLikedByYasmine = eyaListings.filter(listing => 
            listing.likes.some(id => id.toString() === yasmineId)
        );
        
        if (eyaListingsLikedByYasmine.length > 0) {
            console.log(`✅ Yasmine a liké ${eyaListingsLikedByYasmine.length} annonce(s) d'eya:`);
            eyaListingsLikedByYasmine.forEach(listing => {
                console.log(`   - "${listing.title}"`);
            });
            console.log('\n❓ MAIS aucune notification créée! Le contrôleur a un problème.');
        } else {
            console.log('❌ Yasmine n\'a liké AUCUNE annonce d\'eya!');
            console.log('   C\'est pour ça qu\'il n\'y a pas de notification.');
            console.log('\n💡 Pour tester:');
            console.log('   1. Connectez-vous avec yasmine');
            console.log(`   2. Allez sur: http://localhost:3000/listings/${eyaListings[0]?._id}`);
            console.log('   3. Cliquez sur le bouton ❤️ Like');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

checkListings();
