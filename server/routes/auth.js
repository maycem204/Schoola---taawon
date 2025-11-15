const express = require('express');
const router = express.Router();
// Utiliser le contrôleur mock pour les tests
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth');

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);

// Routes protégées
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);

module.exports = router;