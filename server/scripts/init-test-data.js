require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/schoola-taawon';

// Données de test réalistes
const testUsers = [
  {
    username: 'ahmed_tunis',
    email: 'ahmed.tunis@email.com',
    password: 'password123',
    city: 'Tunis',
    address: '15 Avenue Habib Bourguiba, Tunis',
    phone: '+216 20 123 456',
    bio: 'Étudiant en informatique à l\'Université de Tunis El Manar. Passionné par les nouvelles technologies et les livres de programmation.'
  },
  {
    username: 'sarah_sfax',
    email: 'sarah.sfax@email.com',
    password: 'password123',
    city: 'Sfax',
    address: 'Rue de la République, Sfax',
    phone: '+216 74 123 789',
    bio: 'Professeure de mathématiques au lycée. J\'aime partager mes connaissances et aider les élèves.'
  },
  {
    username: 'mehdi_sousse',
    email: 'mehdi.sousse@email.com',
    password: 'password123',
    city: 'Sousse',
    address: 'Avenue du 14 Janvier, Sousse',
    phone: '+216 73 456 789',
    bio: 'Étudiant en médecine. Collectionneur de livres scientifiques et matériels pédagogiques.'
  }
];

const testListings = [
  {
    title: 'Manuel d\'Algèbre Linéaire - Niveau Master',
    description: 'Manuel d\'algèbre linéaire en excellent état. Utilisé pendant mon master en informatique. Comprend tous les exercices résolus et des notes personnelles.',
    category: 'textbooks',
    condition: 'good',
    educationLevel: 'university',
    universityName: 'Université de Tunis El Manar',
    universityCycle: 'master',
    universityDomain: 'informatique',
    city: 'Tunis',
    exchangeType: 'sale',
    price: 45,
    status: 'disponible'
  },
  {
    title: 'Cahiers de Mathématiques - Lycée',
    description: 'Ensemble de 5 cahiers de mathématiques pour le lycée. Exercices de base et avancés. Idéal pour révision.',
    category: 'notebooks',
    condition: 'like_new',
    educationLevel: 'high',
    city: 'Sfax',
    exchangeType: 'exchange',
    estimatedValue: 25,
    status: 'disponible'
  },
  {
    title: 'Matériel de Géométrie Complet',
    description: 'Équerre, compas, règle graduée, rapporteur. Tout le nécessaire pour les cours de géométrie. Peu utilisé.',
    category: 'stationery',
    condition: 'new',
    educationLevel: 'middle',
    city: 'Sousse',
    exchangeType: 'donation',
    status: 'disponible'
  },
  {
    title: 'Calculatrice Graphique TI-84 Plus',
    description: 'Calculatrice graphique Texas Instruments TI-84 Plus. Parfaite pour les cours de mathématiques avancées. Avec mode d\'emploi.',
    category: 'electronics',
    condition: 'good',
    educationLevel: 'high',
    city: 'Tunis',
    exchangeType: 'sale',
    price: 180,
    status: 'disponible'
  },
  {
    title: 'Physique Chimie - Terminale S',
    description: 'Manuel de physique-chimie pour terminale scientifique. Très complet avec exercices et corrigés.',
    category: 'textbooks',
    condition: 'fair',
    educationLevel: 'high',
    city: 'Sfax',
    exchangeType: 'exchange',
    estimatedValue: 35,
    status: 'disponible'
  }
];

async function initTestData() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connecté à MongoDB');

    // Nettoyer les données existantes
    console.log('Suppression des données existantes...');
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});

    // Créer les utilisateurs de test
    console.log('Création des utilisateurs de test...');
    const createdUsers = [];
    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      createdUsers.push(user);
      console.log(`✓ Utilisateur créé: ${user.username}`);
    }

    // Créer les annonces de test
    console.log('Création des annonces de test...');
    const createdListings = [];
    for (let i = 0; i < testListings.length; i++) {
      const listingData = testListings[i];
      const owner = createdUsers[i % createdUsers.length]; // Distribuer les annonces entre les utilisateurs

      const listing = new Listing({
        ...listingData,
        owner: owner._id
      });
      await listing.save();
      createdListings.push(listing);
      console.log(`✓ Annonce créée: ${listing.title}`);
    }

    // Créer quelques conversations et messages de test
    console.log('Création de conversations de test...');

    // Conversation entre Ahmed et Sarah à propos de l'annonce de maths
    const conversation1 = new Conversation({
      participants: [createdUsers[0]._id, createdUsers[1]._id],
      listing: createdListings[1]._id
    });
    await conversation1.save();

    const messages1 = [
      {
        conversation: conversation1._id,
        sender: createdUsers[0]._id,
        content: 'Bonjour Sarah, je suis intéressé par vos cahiers de mathématiques. Sont-ils encore disponibles ?',
        readBy: [createdUsers[0]._id]
      },
      {
        conversation: conversation1._id,
        sender: createdUsers[1]._id,
        content: 'Bonjour Ahmed ! Oui, ils sont toujours disponibles. Vous êtes à Tunis ?',
        readBy: [createdUsers[0]._id, createdUsers[1]._id]
      },
      {
        conversation: conversation1._id,
        sender: createdUsers[0]._id,
        content: 'Parfait ! Je peux venir les chercher à Sfax ce weekend si ça vous arrange.',
        readBy: [createdUsers[0]._id, createdUsers[1]._id]
      }
    ];

    for (const msgData of messages1) {
      const message = new Message(msgData);
      await message.save();
    }

    conversation1.lastMessage = messages1[messages1.length - 1]._id;
    await conversation1.save();

    // Conversation entre Mehdi et Ahmed à propos de la calculatrice
    const conversation2 = new Conversation({
      participants: [createdUsers[2]._id, createdUsers[0]._id],
      listing: createdListings[3]._id
    });
    await conversation2.save();

    const messages2 = [
      {
        conversation: conversation2._id,
        sender: createdUsers[2]._id,
        content: 'Salut Ahmed, ta calculatrice TI-84 est-elle toujours en vente ?',
        readBy: [createdUsers[2]._id]
      },
      {
        conversation: conversation2._id,
        sender: createdUsers[0]._id,
        content: 'Salut Mehdi ! Oui elle est disponible. Elle fonctionne parfaitement.',
        readBy: [createdUsers[2]._id, createdUsers[0]._id]
      }
    ];

    for (const msgData of messages2) {
      const message = new Message(msgData);
      await message.save();
    }

    conversation2.lastMessage = messages2[messages2.length - 1]._id;
    await conversation2.save();

    console.log('\n🎉 Données de test créées avec succès !');
    console.log(`📊 ${createdUsers.length} utilisateurs créés`);
    console.log(`📚 ${createdListings.length} annonces créées`);
    console.log(`💬 2 conversations avec messages créées`);

    console.log('\n👥 Utilisateurs de test :');
    createdUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.email}) - Mot de passe: ${testUsers.find(u => u.username === user.username)?.password}`);
    });

    console.log('\n🔑 Vous pouvez maintenant vous connecter avec ces comptes pour tester l\'application.');

  } catch (error) {
    console.error('Erreur lors de l\'initialisation des données de test:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Déconnexion de MongoDB');
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  initTestData();
}

module.exports = initTestData;
