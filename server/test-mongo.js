const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://eyamanaa3_db_user:jbiUwZH5f5iNKUGg@cluster0.k1lrb.mongodb.net/schoola-taawon?retryWrites=true&w=majority';

console.log('🔄 Test de connexion MongoDB Atlas...');
console.log('URI:', mongoUri);

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ Connexion MongoDB Atlas réussie !');
    process.exit(0);
})
.catch(err => {
    console.error('❌ Erreur de connexion:', err.message);
    console.error('Détails:', err);
    process.exit(1);
});
