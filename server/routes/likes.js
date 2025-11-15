const express = require('express');
const router = express.Router();
const likeController = require('../controllers/like.controller');
const auth = require('../middleware/auth');

// Toutes les routes nécessitent une authentification
router.use(auth);

// POST /api/likes/:listingId/toggle - Liker/Unliker une annonce
router.post('/:listingId/toggle', likeController.toggleLike);

// GET /api/likes/:listingId - Obtenir les likes d'une annonce
router.get('/:listingId', likeController.getListingLikes);

module.exports = router;
