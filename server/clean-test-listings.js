require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/Listing');
const User = require('./models/User');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schoola-taawon';

async function cleanTestListings() {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connecté à MongoDB');
        
        // Trouver l'utilisateur "eya"
        const eyaUser = await User.findOne({ username: 'eya' });
        
        if (!eyaUser) {
            console.log('❌ Utilisateur "eya" non trouvé');
            console.log('📋 Liste des utilisateurs:');
            const users = await User.find({}, 'username email');
            users.forEach(u => console.log(`  - ${u.username} (${u.email})`));
            process.exit(1);
        }
        
        console.log(`✅ Utilisateur "eya" trouvé: ${eyaUser._id}`);
        
        // Compter les annonces avant suppression
        const totalBefore = await Listing.countDocuments();
        const eyaListingsBefore = await Listing.countDocuments({ owner: eyaUser._id });
        
        console.log(`📊 Avant nettoyage:`);
        console.log(`  - Total annonces: ${totalBefore}`);
        console.log(`  - Annonces de eya: ${eyaListingsBefore}`);
        
        // Supprimer toutes les annonces qui n'appartiennent PAS à eya
        const result = await Listing.deleteMany({ 
            owner: { $ne: eyaUser._id } 
        });
        
        console.log(`\n🗑️  ${result.deletedCount} annonce(s) de test supprimée(s)`);
        
        // Compter après suppression
        const totalAfter = await Listing.countDocuments();
        const eyaListingsAfter = await Listing.countDocuments({ owner: eyaUser._id });
        
        console.log(`\n📊 Après nettoyage:`);
        console.log(`  - Total annonces: ${totalAfter}`);
        console.log(`  - Annonces de eya: ${eyaListingsAfter}`);
        
        // Afficher les annonces restantes
        console.log(`\n📋 Annonces de eya:`);
        const eyaListings = await Listing.find({ owner: eyaUser._id });
        eyaListings.forEach(listing => {
            console.log(`  - ${listing.title} (${listing.category})`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

cleanTestListings();
