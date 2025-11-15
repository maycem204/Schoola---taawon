const mongoose = require('mongoose');

async function checkMongo() {
    try {
        console.log('🔍 Test de connexion MongoDB...');
        await mongoose.connect('mongodb://localhost:27017/schoola-taawon', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB connecté avec succès !');
        
        // Test de création de données
        const testSchema = new mongoose.Schema({
            test: String
        });
        const TestModel = mongoose.model('Test', testSchema);
        
        const doc = new TestModel({ test: 'Données persistantes' });
        await doc.save();
        
        console.log('✅ Données sauvegardées dans MongoDB !');
        
        const count = await TestModel.countDocuments();
        console.log(`📊 Nombre de documents: ${count}`);
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Erreur MongoDB:', error.message);
        process.exit(1);
    }
}

checkMongo();
