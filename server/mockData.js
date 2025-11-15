// PERSISTANCE RÉELLE avec fichier JSON
const { loadData, saveData } = require('./utils/dataStorage');

// Charger les données au démarrage
const data = loadData();

let users = data.users;
let listings = data.listings;
let conversations = data.conversations;
let messages = data.messages;
let notifications = data.notifications;

// Sauvegarder automatiquement toutes les 10 secondes
setInterval(() => {
  saveData({ users, listings, conversations, messages, notifications });
}, 10000);

// Sauvegarder à l'arrêt du serveur
process.on('SIGINT', () => {
  saveData({ users, listings, conversations, messages, notifications });
  process.exit();
});

module.exports = {
  users,
  listings,
  conversations,
  messages,
  notifications,
  saveData: () => saveData({ users, listings, conversations, messages, notifications })
};
