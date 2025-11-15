#!/usr/bin/env node
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');

// Schéma utilisateur avec pré-sauvegarde pour le hachage du mot de passe
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Veuillez entrer un email valide"]
    },
    password: { type: String, required: true, minlength: 6 },
    city: { type: String, required: true },
    role: { type: String, default: 'user' }
});

UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const initDb = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(
            process.env.MONGO_URI || 'mongodb://localhost:27017/schoola_taawon_prod',
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
        console.log('Connecté à MongoDB');

        // Création des index
        await Promise.all([
            mongoose.connection.collection('listings').createIndex({ title: "text", description: "text" }),
            mongoose.connection.collection('listings').createIndex({ category: 1, city: 1, status: 1 }),
            mongoose.connection.collection('users').createIndex({ email: 1 }, { unique: true }),
            mongoose.connection.collection('users').createIndex({ username: 1 }, { unique: true }),
            mongoose.connection.collection('conversations').createIndex({ participants: 1 }),
            mongoose.connection.collection('messages').createIndex({ conversation: 1, createdAt: 1 })
        ]);
        console.log('Index créés avec succès');

        // Validation des collections
        await mongoose.connection.db.createCollection("users", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["username", "email", "password", "city"],
                    properties: {
                        username: { bsonType: "string", minLength: 3, maxLength: 30 },
                        email: {
                            bsonType: "string",
                            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
                        },
                        password: { bsonType: "string", minLength: 6 },
                        city: { bsonType: "string", minLength: 1 }
                    }
                }
            }
        });

        await mongoose.connection.db.createCollection("listings", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: ["title", "description", "category", "condition", "educationLevel", "city", "owner"],
                    properties: {
                        title: { bsonType: "string", minLength: 3, maxLength: 100 },
                        description: { bsonType: "string", minLength: 10, maxLength: 1000 },
                        category: { enum: ["livres", "cahiers", "sacs", "calculatrices", "materiel_dessin", "autres"] },
                        condition: { enum: ["neuf", "excellent", "bon", "correct"] },
                        status: { enum: ["disponible", "en_echange", "echange_termine"] }
                    }
                }
            }
        });
        console.log('Collections créées avec succès');

        // Création de l'utilisateur admin si nécessaire
        const User = mongoose.model('User', UserSchema);
        const adminUser = {
            username: process.env.ADMIN_USERNAME || 'admin',
            email: process.env.ADMIN_EMAIL || 'admin@schoola-taawon.com',
            password: process.env.ADMIN_PASSWORD || 'changeme123',
            city: 'Tunis',
            role: 'admin'
        };

        const existingAdmin = await User.findOne({ email: adminUser.email });
        if (!existingAdmin) {
            await User.create(adminUser);
            console.log('Utilisateur administrateur créé avec succès');
        }

        console.log('Initialisation de la base de données terminée');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
    }
};

// Exécution du script
initDb();
