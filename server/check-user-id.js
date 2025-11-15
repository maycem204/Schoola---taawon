require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Listing = require('./models/Listing');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/schoola-taawon';

async function checkUserId() {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connecté à MongoDB\n');
        
        // Lister tous les utilisateurs
        console.log('👥 Utilisateurs dans la base de données:');
        const users = await User.find({}, 'username email _id');
        users.forEach(u => {
            console.log(`  - ${u.username} (${u.email})`);
            console.log(`    ID: ${u._id}`);
            console.log(`    ID toString: ${u._id.toString()}\n`);
        });
        
        // Vérifier les annonces et leurs propriétaires
        console.log('\n📋 Annonces et leurs propriétaires:');
        const listings = await Listing.find({}).populate('owner', 'username email');
        listings.forEach(l => {
            console.log(`  - "${l.title}"`);
            console.log(`    Owner ID (raw): ${l.owner}`);
            console.log(`    Owner ID (toString): ${l.owner.toString()}`);
            if (l.owner && typeof l.owner === 'object') {
                console.log(`    Owner username: ${l.owner.username}`);
                console.log(`    Owner._id: ${l.owner._id}`);
                console.log(`    Owner._id (toString): ${l.owner._id.toString()}`);
            }
            console.log('');
        });
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

checkUserId();
