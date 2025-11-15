const express = require('express');
const router = express.Router();
// Système hybride : mock si MongoDB non disponible
const listingController = require('../controllers/listing.controller');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Routes publiques
router.get('/', listingController.getListings);
router.get('/:id', listingController.getListingById);

// Routes protégées
router.post('/', auth, upload.array('images', 5), listingController.createListing);
router.put('/:id', auth, upload.array('images', 5), listingController.updateListing);
router.delete('/:id', auth, listingController.deleteListing);
router.patch('/:id/status', auth, listingController.updateListingStatus);
router.post('/:id/like', auth, listingController.toggleLike);

// IMPORTANT: Route /my-listings APRÈS les routes avec :id
router.get('/my-listings', auth, listingController.getMyListings);

module.exports = router;