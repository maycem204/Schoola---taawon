const Listing = require('../models/Listing');

exports.createListing = async (req, res) => {
    try {
        console.log('📝 Création annonce - User:', req.user);
        console.log('📝 Body:', req.body);
        
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }
        
        // Récupérer les chemins des images uploadées
        const imagePaths = req.files ? req.files.map(file => file.filename) : [];
        
        // Convertir le type d'échange
        let listingType = req.body.listingType || req.body.exchangeType;
        if (listingType === 'sale') listingType = 'vente';
        if (listingType === 'exchange') listingType = 'echange';
        if (listingType === 'donation') listingType = 'don';

        // Préparer les données de l'annonce
        const listingData = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            condition: req.body.condition,
            educationLevel: req.body.educationLevel,
            city: req.body.city,
            listingType: listingType,
            owner: req.user.userId,
            images: imagePaths
        };

        // Ajouter le prix si nécessaire
        if ((listingType === 'vente' || listingType === 'sale') && req.body.price) {
            listingData.price = parseFloat(req.body.price);
        }
        if ((listingType === 'echange' || listingType === 'exchange') && req.body.estimatedValue) {
            listingData.estimatedValue = parseFloat(req.body.estimatedValue);
        }

        // Ajouter les détails universitaires si niveau université
        if (req.body.educationLevel === 'university') {
            listingData.universityDetails = {
                university: req.body.universityName,
                faculty: req.body.universityDomain,
                degree: req.body.universityCycle
            };
        }

        const listing = new Listing(listingData);
        await listing.save();
        
        console.log('✅ Annonce créée:', listing._id, listing.title);
        
        // Peupler les données pour la réponse
        const populatedListing = await Listing.findById(listing._id)
            .populate('owner', 'username profilePicture');
        
        console.log('✅ Annonce peuplée:', populatedListing);
            
        res.status(201).json(populatedListing);
    } catch (error) {
        console.error('Erreur création annonce:', error);
        
        // Erreur de validation Mongoose
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                message: "Erreur de validation",
                errors: errors,
                details: error.errors
            });
        }
        
        res.status(500).json({
            message: "Erreur lors de la création de l'annonce",
            error: error.message
        });
    }
};

exports.getListings = async (req, res) => {
    try {
        const {
            category,
            educationLevel,
            city,
            status,
            search,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        if (category) query.category = category;
        if (educationLevel) query.educationLevel = educationLevel;
        if (city) query.city = city;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const listings = await Listing.find(query)
            .populate('owner', 'username')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Listing.countDocuments(query);

        // Transformer les listings pour compatibilité frontend
        const listingsWithId = listings.map(listing => {
            const obj = listing.toObject();
            if (obj.owner && obj.owner._id) {
                obj.owner.id = obj.owner._id.toString();
            }
            return obj;
        });

        res.json({
            listings: listingsWithId,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des annonces",
            error: error.message
        });
    }
};

exports.getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate('owner', 'username city');

        if (!listing) {
            return res.status(404).json({
                message: "Annonce non trouvée"
            });
        }

        // Transformer en objet et ajouter id pour compatibilité frontend
        const listingObj = listing.toObject();
        if (listingObj.owner && listingObj.owner._id) {
            listingObj.owner.id = listingObj.owner._id.toString();
        }

        res.json(listingObj);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération de l'annonce",
            error: error.message
        });
    }
};

exports.getMyListings = async (req, res) => {
    try {
        const listings = await Listing.find({ owner: req.user.userId })
            .populate('owner', 'username city')
            .sort({ createdAt: -1 });

        // Transformer les listings pour compatibilité frontend
        const listingsWithId = listings.map(listing => {
            const obj = listing.toObject();
            if (obj.owner && obj.owner._id) {
                obj.owner.id = obj.owner._id.toString();
            }
            return obj;
        });

        res.json({
            listings: listingsWithId,
            total: listings.length
        });
    } catch (error) {
        console.error('Erreur récupération annonces utilisateur:', error);
        res.status(500).json({
            message: "Erreur lors de la récupération de vos annonces",
            error: error.message
        });
    }
};

exports.updateListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({
                message: "Annonce non trouvée"
            });
        }

        if (listing.owner.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "Vous n'êtes pas autorisé à modifier cette annonce"
            });
        }

        Object.assign(listing, req.body);
        await listing.save();

        res.json(listing);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la mise à jour de l'annonce",
            error: error.message
        });
    }
};

exports.deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({
                message: "Annonce non trouvée"
            });
        }

        if (listing.owner.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "Vous n'êtes pas autorisé à supprimer cette annonce"
            });
        }

        await listing.remove();

        res.json({
            message: "Annonce supprimée avec succès"
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la suppression de l'annonce",
            error: error.message
        });
    }
};

exports.updateListingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({
                message: "Annonce non trouvée"
            });
        }

        if (listing.owner.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "Vous n'êtes pas autorisé à modifier le statut de cette annonce"
            });
        }

        listing.status = status;
        await listing.save();

        res.json(listing);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la mise à jour du statut de l'annonce",
            error: error.message
        });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        
        if (!listing) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }
        
        const userId = req.user.userId;
        const likeIndex = listing.likes.indexOf(userId);
        
        if (likeIndex > -1) {
            listing.likes.splice(likeIndex, 1);
        } else {
            listing.likes.push(userId);
        }
        
        await listing.save();
        
        res.json({
            liked: likeIndex === -1,
            likesCount: listing.likes.length
        });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors du like",
            error: error.message
        });
    }
};