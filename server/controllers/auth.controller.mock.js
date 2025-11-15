// Contrôleur d'authentification mock pour les tests
const jwt = require('jsonwebtoken');
const mockData = require('../mockData');

exports.register = async (req, res) => {
    try {
        console.log('📝 Inscription mock:', req.body.username);
        
        // Créer un ID unique basé sur l'email
        const userId = 'user_' + Buffer.from(req.body.email).toString('base64').slice(0, 8);
        
        // Simuler une inscription réussie avec ID unique
        const user = {
            id: userId,
            username: req.body.username,
            email: req.body.email,
            city: req.body.city || 'tunis'
        };
        
        // Créer un token avec l'ID unique
        const token = jwt.sign(
            { userId: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET || 'secret-key',
            { expiresIn: '24h' }
        );
        
        // Ajouter l'utilisateur à la base
        mockData.users.push(user);
        
        // SAUVEGARDER IMMÉDIATEMENT
        if (mockData.saveData) mockData.saveData();
        
        console.log(' Utilisateur créé et sauvegardé:', user.username, 'avec ID:', user.id);
        
        res.status(201).json({
            message: 'Inscription réussie',
            user: user,
            token: token
        });
    } catch (error) {
        console.error('❌ Erreur inscription:', error);
        res.status(500).json({
            message: "Erreur lors de l'inscription",
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        console.log('🔐 Connexion mock:', req.body.email);
        
        // Créer un ID unique basé sur l'email (même logique que register)
        const userId = 'user_' + Buffer.from(req.body.email).toString('base64').slice(0, 8);
        
        // Simuler une connexion réussie avec ID unique
        const user = {
            id: userId,
            username: req.body.email.split('@')[0], // Username basé sur l'email
            email: req.body.email,
            city: 'tunis'
        };
        
        // Créer un token avec l'ID unique
        const token = jwt.sign(
            { userId: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET || 'secret-key',
            { expiresIn: '24h' }
        );
        
        console.log('✅ Connexion réussie - ID:', user.id, 'User:', user.username);
        
        res.json({
            message: 'Connexion réussie',
            user: user,
            token: token
        });
    } catch (error) {
        console.error('❌ Erreur connexion:', error);
        res.status(500).json({
            message: "Erreur lors de la connexion",
            error: error.message
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = {
            id: req.user.userId,
            username: req.user.username,
            email: 'eya@test.com',
            city: 'tunis'
        };
        
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération du profil",
            error: error.message
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        console.log('📝 Mise à jour profil:', req.body);
        
        const updatedUser = {
            id: req.user.userId,
            username: req.body.username || req.user.username,
            email: req.body.email || 'eya@test.com',
            city: req.body.city || 'tunis'
        };
        
        console.log('✅ Profil mis à jour pour:', updatedUser.username);
        
        res.json({
            message: 'Profil mis à jour avec succès',
            user: updatedUser
        });
    } catch (error) {
        console.error('❌ Erreur mise à jour profil:', error);
        res.status(500).json({
            message: "Erreur lors de la mise à jour du profil",
            error: error.message
        });
    }
};
