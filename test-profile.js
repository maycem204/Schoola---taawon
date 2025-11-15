// Test du profil - Mes annonces
const mockData = require('./server/mockData');

console.log('🧪 Test du profil - Mes annonces\n');

// Simuler l'utilisateur connecté
const currentUser = {
    userId: 'eya123',
    username: 'eya'
};

console.log('👤 Utilisateur connecté:', currentUser.username, '(ID:', currentUser.userId + ')');
console.log('');

// Filtrer les annonces de l'utilisateur
const userListings = mockData.listings.filter(l => l.owner === currentUser.userId);

console.log('📋 Annonces dans la base de données:');
mockData.listings.forEach(listing => {
    const isOwner = listing.owner === currentUser.userId;
    console.log(`- ${listing.title} (Propriétaire: ${listing.owner}) ${isOwner ? '← VOUS' : ''}`);
});

console.log('');
console.log('🎯 Vos annonces (ce qui devrait apparaître dans le profil):');
if (userListings.length > 0) {
    userListings.forEach(listing => {
        console.log(`✅ ${listing.title} - ${listing.listingType} - ${listing.city}`);
    });
} else {
    console.log('❌ Aucune annonce trouvée pour cet utilisateur');
}

console.log('');
console.log('📊 Résumé:');
console.log(`Total annonces: ${mockData.listings.length}`);
console.log(`Vos annonces: ${userListings.length}`);
console.log(`Autres annonces: ${mockData.listings.length - userListings.length}`);

console.log('');
console.log('🔍 Actions à faire:');
console.log('1. Allez sur http://localhost:3000/profile');
console.log('2. Vérifiez que vous voyez vos annonces');
console.log('3. Si pas d\'annonces, regardez la console du navigateur');
console.log('4. Créez une nouvelle annonce pour tester');
