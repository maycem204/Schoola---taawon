const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017';
const dbName = 'schoola_taawon';

async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri);
        const db = client.db(dbName);

        // Création des collections
        await Promise.all([
            db.createCollection('users'),
            db.createCollection('listings'),
            db.createCollection('conversations'),
            db.createCollection('messages')
        ]);

        // Création des index
        await Promise.all([
            db.collection('users').createIndex({ "email": 1 }, { unique: true }),
            db.collection('users').createIndex({ "username": 1 }, { unique: true }),
            db.collection('listings').createIndex({ "title": "text", "description": "text" }),
            db.collection('listings').createIndex({ "category": 1, "city": 1, "status": 1 }),
            db.collection('conversations').createIndex({ "participants": 1 }),
            db.collection('messages').createIndex({ "conversation": 1, "createdAt": -1 })
        ]);

        // Création d'un utilisateur de test
        const hashedPassword = await bcrypt.hash('password123', 12);
        await db.collection('users').insertOne({
            username: "test_user",
            email: "test@schoola-taawon.com",
            password: hashedPassword,
            city: "Tunis",
            profilePicture: ""
        });

        console.log('Base de données initialisée avec succès!');
        console.log('Un utilisateur de test a été créé pour le développement.');
        
        await client.close();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        process.exit(1);
    }
}

initializeDatabase();