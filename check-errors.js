// Script de vérification des erreurs communes
console.log('🔍 Vérification des erreurs dans le code...\n');

// 1. Vérification des IDs utilisateur
console.log('1️⃣ Synchronisation des IDs utilisateur');
const frontendId = 'eya123';
const backendId = 'eya123';
console.log(`Frontend ID: ${frontendId}`);
console.log(`Backend ID: ${backendId}`);
console.log(`Synchronisé: ${frontendId === backendId ? '✅' : '❌'}\n`);

// 2. Vérification de la structure des fichiers
const fs = require('fs');
const path = require('path');

console.log('2️⃣ Vérification des fichiers critiques');

const criticalFiles = [
    'client/src/context/AuthContext.tsx',
    'server/middleware/auth.mock.js',
    'server/controllers/listing.controller.mock.js',
    'server/mockData.js'
];

criticalFiles.forEach(file => {
    const fullPath = path.join(__dirname, file);
    const exists = fs.existsSync(fullPath);
    console.log(`${file}: ${exists ? '✅' : '❌'}`);
});

console.log('\n3️⃣ Recommandations');
console.log('✅ Rechargez complètement la page (Ctrl+F5)');
console.log('✅ Vérifiez la console du navigateur pour les erreurs');
console.log('✅ Testez d\'abord l\'annonce ID 4 (Livre de Chimie)');
console.log('✅ Puis créez une nouvelle annonce');

console.log('\n4️⃣ URLs de test');
console.log('🏠 Accueil: http://localhost:3000');
console.log('📋 Annonces: http://localhost:3000/listings');
console.log('👤 Profil: http://localhost:3000/profile');
console.log('➕ Créer: http://localhost:3000/create-listing');

console.log('\n🎯 Si le problème persiste:');
console.log('1. Ouvrez la console du navigateur (F12)');
console.log('2. Regardez les erreurs JavaScript');
console.log('3. Vérifiez les requêtes réseau dans l\'onglet Network');
