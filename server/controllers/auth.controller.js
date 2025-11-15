const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        console.log('📝 Inscription:', req.body.username);
        const { username, email, password, city } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ 
                message: userExists.email === email 
                    ? 'Cet email est déjà utilisé' 
                    : "Ce nom d'utilisateur est déjà pris"
            });
        }

        // Créer le nouvel utilisateur
        const user = new User({
            username,
            email,
            password,
            city
        });

        await user.save();
        console.log('✅ Utilisateur créé:', user.username, 'ID:', user._id);

        // Générer le token JWT avec TOUTES les infos nécessaires
        const token = jwt.sign(
            { 
                userId: user._id,
                username: user.username,
                email: user.email
            },
            process.env.JWT_SECRET || 'secret-key',
            { expiresIn: '24h' }
        );

        // Envoyer la réponse sans le mot de passe
        const userResponse = user.toObject();
        delete userResponse.password;
        
        // Transformer _id en id pour le frontend
        userResponse.id = userResponse._id.toString();

        res.status(201).json({
            message: 'Inscription réussie',
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('❌ Erreur inscription:', error);
        res.status(500).json({
            message: 'Erreur lors de l\'inscription',
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        console.log('🔐 Connexion:', req.body.email);
        const { email, password } = req.body;

        // Trouver l'utilisateur
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Vérifier le mot de passe
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({
                message: 'Email ou mot de passe incorrect'
            });
        }

        console.log('✅ Connexion réussie:', user.username);

        // Générer le token JWT avec TOUTES les infos nécessaires
        const token = jwt.sign(
            { 
                userId: user._id,
                username: user.username,
                email: user.email
            },
            process.env.JWT_SECRET || 'secret-key',
            { expiresIn: '24h' }
        );

        // Envoyer la réponse sans le mot de passe
        const userResponse = user.toObject();
        delete userResponse.password;
        
        // Transformer _id en id pour le frontend
        userResponse.id = userResponse._id.toString();

        res.json({
            message: 'Connexion réussie',
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('❌ Erreur connexion:', error);
        res.status(500).json({
            message: 'Erreur lors de la connexion',
            error: error.message
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la récupération du profil',
            error: error.message
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, city, address, phone, bio, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: 'Utilisateur non trouvé'
            });
        }

        // Si un nouveau mot de passe est fourni
        if (currentPassword && newPassword) {
            const isValid = await user.comparePassword(currentPassword);
            if (!isValid) {
                return res.status(401).json({
                    message: 'Mot de passe actuel incorrect'
                });
            }
            user.password = newPassword;
        }

        // Mettre à jour les autres champs
        if (username) user.username = username;
        if (city) user.city = city;
        if (address !== undefined) user.address = address;
        if (phone !== undefined) user.phone = phone;
        if (bio !== undefined) user.bio = bio;

        await user.save();

        // Envoyer la réponse sans le mot de passe
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({
            message: 'Profil mis à jour avec succès',
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du profil',
            error: error.message
        });
    }
};
