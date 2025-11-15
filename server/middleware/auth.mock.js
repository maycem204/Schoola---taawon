// Middleware d'authentification qui utilise les VRAIS tokens JWT
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Essayer de récupérer le token depuis l'en-tête Authorization
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            
            try {
                // Décoder le token pour obtenir les VRAIES infos utilisateur
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
                req.user = {
                    userId: decoded.userId,
                    username: decoded.username,
                    email: decoded.email
                };
                console.log('🔐 Utilisateur authentifié:', req.user.username, 'ID:', req.user.userId);
                return next();
            } catch (tokenError) {
                console.log('⚠️ Token invalide');
                return res.status(401).json({ message: 'Token invalide' });
            }
        }
        
        // Pas de token = non autorisé
        console.log('⚠️ Aucun token fourni');
        return res.status(401).json({ message: 'Authentification requise' });
        
    } catch (error) {
        console.error('❌ Erreur auth middleware:', error);
        return res.status(401).json({ message: 'Erreur d\'authentification' });
    }
};
