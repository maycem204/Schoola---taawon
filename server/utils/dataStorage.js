const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data.json');

// Charger les données depuis le fichier
const loadData = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            console.log('📂 Données chargées depuis le fichier');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('❌ Erreur chargement données:', error);
    }
    
    // Données par défaut si le fichier n'existe pas
    return {
        users: [],
        listings: [],
        conversations: [],
        messages: [],
        notifications: []
    };
};

// Sauvegarder les données dans le fichier
const saveData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        console.log('💾 Données sauvegardées:', {
            users: data.users.length,
            listings: data.listings.length,
            conversations: data.conversations.length,
            messages: data.messages.length,
            notifications: data.notifications.length
        });
    } catch (error) {
        console.error('❌ Erreur sauvegarde données:', error);
    }
};

module.exports = { loadData, saveData };
