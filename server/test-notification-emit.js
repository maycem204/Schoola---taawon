require('dotenv').config();
const io = require('socket.io-client');

// Se connecter à Socket.IO en tant qu'eya
const socket = io('http://localhost:5001', {
    auth: {
        token: '690f22f954129716412c8ba8' // ID d'eya
    }
});

socket.on('connect', () => {
    console.log('✅ Connecté à Socket.IO');
    console.log('   Socket ID:', socket.id);
    
    // Écouter les notifications
    socket.on('new_notification', (data) => {
        console.log('\n🎉 NOTIFICATION REÇUE!');
        console.log('   Titre:', data.title);
        console.log('   Message:', data.message);
        console.log('   Type:', data.type);
        console.log('');
        
        // Fermer après réception
        setTimeout(() => {
            console.log('✅ Test réussi! La notification fonctionne.');
            process.exit(0);
        }, 1000);
    });
    
    console.log('⏳ En attente de notification...');
    console.log('   Maintenant, avec un autre compte, likez une annonce d\'eya');
    console.log('');
});

socket.on('connect_error', (error) => {
    console.error('❌ Erreur de connexion:', error.message);
    process.exit(1);
});

socket.on('disconnect', () => {
    console.log('Socket.IO déconnecté');
});

// Garder le script actif
setTimeout(() => {
    console.log('\n⏱️  Timeout - Aucune notification reçue en 60 secondes');
    process.exit(1);
}, 60000);
