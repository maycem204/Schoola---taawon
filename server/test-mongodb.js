const mongoose = require('mongoose');
const User = require('./models/User');
const Listing = require('./models/Listing');

async function testMongoDB() {
    try {
        console.log('🔗 Connexion à MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/schoola-taawon');
        console.log('✅ Connecté à MongoDB');

        // Vérifier si des données existent déjà
        const usersCount = await User.countDocuments();
        const listingsCount = await Listing.countDocuments();
        
        console.log(`📊 Données actuelles - Users: ${usersCount}, Listings: ${listingsCount}`);

        // Créer un utilisateur test
        if (usersCount === 0) {
            const testUser = new User({
                username: 'TestUser',
                email: 'test@test.com',
                password: 'password123',
                city: 'Tunis'
            });
            await testUser.save();
            console.log('✅ Utilisateur test créé');
        }

        // Vérifier après création
        const newUsersCount = await User.countDocuments();
        console.log(`📊 Après création - Users: ${newUsersCount}`);

        // Créer une annonce test
        if (listingsCount === 0) {
            const user = await User.findOne({ email: 'test@test.com' });
            const testListing = new Listing({
                title: 'Annonce Test',
                description: 'Description test',
                category: 'livres',
                condition: 'bon',
                educationLevel: 'universitaire',
                city: 'Tunis',
                listingType: 'vente',
                owner: user._id,
                price: 50
            });
            await testListing.save();
            console.log('✅ Annonce test créée');
        }

        // Vérifier final
        const finalUsersCount = await User.countDocuments();
        const finalListingsCount = await Listing.countDocuments();
        
        console.log(`📊 Final - Users: ${finalUsersCount}, Listings: ${finalListingsCount}`);
        
        console.log('✅ Test MongoDB réussi - Les données sont persistantes !');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur MongoDB:', error);
        process.exit(1);
    }
}

testMongoDB();
