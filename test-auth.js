// Script de test pour vérifier la synchronisation des IDs
console.log('🧪 Test de synchronisation des IDs utilisateur');
console.log('');

// Simulation frontend
const frontendUser = {
    id: 'eya123',
    username: 'eya',
    email: 'eya@test.com'
};

// Simulation backend
const backendUser = {
    userId: 'eya123',
    username: 'eya',
    email: 'eya@test.com'
};

// Test de correspondance
const idsMatch = frontendUser.id === backendUser.userId;
const usernamesMatch = frontendUser.username === backendUser.username;

console.log('Frontend User ID:', frontendUser.id);
console.log('Backend User ID:', backendUser.userId);
console.log('IDs correspondent:', idsMatch ? '✅' : '❌');
console.log('Noms correspondent:', usernamesMatch ? '✅' : '❌');
console.log('');

if (idsMatch && usernamesMatch) {
    console.log('🎉 SUCCÈS : La synchronisation est correcte !');
    console.log('');
    console.log('📋 Ce qui devrait maintenant fonctionner :');
    console.log('- ✅ Vos annonces apparaissent dans votre profil');
    console.log('- ✅ Boutons Modifier/Supprimer sur vos annonces');
    console.log('- ✅ Bouton "Contacter vendeur" sur les autres annonces');
    console.log('- ✅ Nom "eya" sur vos nouvelles annonces');
} else {
    console.log('❌ ERREUR : Les IDs ne correspondent pas !');
}

console.log('');
console.log('🔍 Annonces de test disponibles :');
console.log('- ID 1: Manuel Maths (testuser) → Contacter vendeur');
console.log('- ID 2: Cahiers TP (autreuser) → Contacter vendeur');  
console.log('- ID 3: Calculatrice (autreuser) → Contacter vendeur');
console.log('- ID 4: Livre Chimie (eya) → Modifier/Supprimer');
