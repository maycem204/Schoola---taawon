const mockData = require('../mockData');

exports.createListing = async (req, res) => {
    try {
        console.log('📝 Création d\'annonce (mode test):', req.body);
        
        // Convertir le type d'échange
        let listingType = req.body.listingType || req.body.exchangeType;
        if (listingType === 'sale') listingType = 'vente';
        if (listingType === 'exchange') listingType = 'echange';
        if (listingType === 'donation') listingType = 'don';

        // Créer une nouvelle annonce avec les infos utilisateur
        const newListing = {
            _id: Date.now().toString(),
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            condition: req.body.condition,
            educationLevel: req.body.educationLevel,
            city: req.body.city,
            listingType: listingType,
            owner: req.user?.userId || '1',
            ownerUsername: req.user?.username, // Stocker le nom d'utilisateur
            images: req.files ? req.files.map(file => file.filename) : [],
            status: 'disponible',
            likes: [],
            likesCount: 0,
            createdAt: new Date()
        };

        // Ajouter le prix si nécessaire
        if ((listingType === 'vente' || listingType === 'sale') && req.body.price) {
            newListing.price = parseFloat(req.body.price);
        }
        if ((listingType === 'echange' || listingType === 'exchange') && req.body.estimatedValue) {
            newListing.estimatedValue = parseFloat(req.body.estimatedValue);
        }

        // Ajouter les détails universitaires si niveau université
        if (req.body.educationLevel === 'university') {
            newListing.universityDetails = {
                university: req.body.universityName,
                faculty: req.body.universityDomain,
                degree: req.body.universityCycle
            };
        }

        // Ajouter à la liste en mémoire
        mockData.listings.push(newListing);
        
        // SAUVEGARDER IMMÉDIATEMENT
        if (mockData.saveData) mockData.saveData();
        
        console.log('✅ Annonce créée et sauvegardée:', newListing.title);
        res.status(201).json(newListing);
    } catch (error) {
        console.error('❌ Erreur création annonce:', error);
        res.status(500).json({
            message: "Erreur lors de la création de l'annonce",
            error: error.message
        });
    }
};

exports.getListings = async (req, res) => {
    try {
        console.log('📋 Récupération des annonces (mode test)');
        
        // Simuler la population du owner avec des noms dynamiques
        const populatedListings = mockData.listings.map(listing => {
            let username = 'utilisateur';
            
            // Trouver l'utilisateur réel dans la base
            const ownerUser = mockData.users.find(u => u._id === listing.owner);
            if (ownerUser) {
                username = ownerUser.username;
            } else if (listing.ownerUsername) {
                username = listing.ownerUsername;
            } else {
                username = 'Utilisateur';
            }
            
            return {
                ...listing,
                owner: {
                    _id: listing.owner,
                    username: username,
                    profilePicture: '',
                    city: 'tunis'
                }
            };
        });
        
        res.json({
            listings: populatedListings,
            total: populatedListings.length
        });
    } catch (error) {
        console.error('❌ Erreur récupération annonces:', error);
        res.status(500).json({
            message: "Erreur lors de la récupération des annonces",
            error: error.message
        });
    }
};

exports.getListingById = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = mockData.listings.find(l => l._id === id);
        
        if (!listing) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }
        
        // Simuler la population avec l'ID correct
        let username = 'utilisateur';
        if (listing.owner === '1') username = 'testuser';
        else if (listing.owner === '2') username = 'autreuser';
        else if (listing.owner === 'eya123') username = 'eya';
        else username = 'eya'; // Pour les nouvelles annonces
        
        const populatedListing = {
            ...listing,
            owner: {
                _id: listing.owner,
                username: username,
                profilePicture: '',
                city: 'tunis'
            }
        };
        
        res.json(populatedListing);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération de l'annonce",
            error: error.message
        });
    }
};

exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listingIndex = mockData.listings.findIndex(l => l._id === id);
        
        if (listingIndex === -1) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }
        
        // Mettre à jour l'annonce
        mockData.listings[listingIndex] = {
            ...mockData.listings[listingIndex],
            ...req.body,
            updatedAt: new Date()
        };
        
        res.json(mockData.listings[listingIndex]);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la mise à jour de l'annonce",
            error: error.message
        });
    }
};

exports.deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listingIndex = mockData.listings.findIndex(l => l._id === id);
        
        if (listingIndex === -1) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }
        
        mockData.listings.splice(listingIndex, 1);
        res.json({ message: 'Annonce supprimée avec succès' });
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la suppression de l'annonce",
            error: error.message
        });
    }
};

exports.getMyListings = async (req, res) => {
    try {
        console.log('📋 MES ANNONCES - Utilisateur:', req.user.userId, req.user.username);
        console.log('📋 Total annonces en base:', mockData.listings.length);
        
        const userListings = mockData.listings.filter(l => {
            const isOwner = l.owner === req.user.userId;
            console.log('🔍 Annonce:', l.title, '- Owner:', l.owner, '- Moi:', req.user.userId, '- À moi:', isOwner);
            return isOwner;
        });
        
        // Utiliser les vrais noms d'utilisateurs
        const populatedListings = userListings.map(listing => {
            const ownerUser = mockData.users.find(u => u._id === listing.owner);
            const username = ownerUser ? ownerUser.username : req.user.username;
            
            return {
                ...listing,
                owner: {
                    _id: listing.owner,
                    username: username,
                    profilePicture: '',
                    city: 'tunis'
                }
            };
        });
        
        console.log(`✅ MES ANNONCES trouvées: ${populatedListings.length} pour ${req.user.username}`);
        
        // Retourner dans le format attendu par le frontend
        res.json({
            listings: populatedListings,
            total: populatedListings.length
        });
    } catch (error) {
        console.error('❌ Erreur getMyListings:', error);
        res.status(500).json({
            message: "Erreur lors de la récupération de vos annonces",
            error: error.message
        });
    }
};

exports.updateListingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const listingIndex = mockData.listings.findIndex(l => l._id === id);
        
        if (listingIndex === -1) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }
        
        mockData.listings[listingIndex].status = status;
        res.json(mockData.listings[listingIndex]);
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la mise à jour du statut",
            error: error.message
        });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        
        console.log('👍 Toggle like pour annonce:', id, 'par utilisateur:', userId);
        
        const listingIndex = mockData.listings.findIndex(l => l._id === id);
        
        if (listingIndex === -1) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }
        
        const listing = mockData.listings[listingIndex];
        
        // Initialiser likes si pas défini
        if (!listing.likes) listing.likes = [];
        
        // Vérifier si l'utilisateur a déjà liké
        const likeIndex = listing.likes.indexOf(userId);
        
        if (likeIndex > -1) {
            // Retirer le like
            listing.likes.splice(likeIndex, 1);
            console.log('❌ Like retiré');
        } else {
            // Ajouter le like
            listing.likes.push(userId);
            console.log('✅ Like ajouté');
            
            // Créer une notification pour le propriétaire
            if (listing.owner !== userId) {
                const notification = {
                    _id: Date.now().toString(),
                    recipient: listing.owner,
                    type: 'like',
                    message: `Quelqu'un a aimé votre annonce "${listing.title}"`,
                    listing: id,
                    read: false,
                    createdAt: new Date()
                };
                
                mockData.notifications.push(notification);
                console.log('🔔 Notification créée pour le propriétaire');
            }
        }
        
        // Mettre à jour le compteur
        listing.likesCount = listing.likes.length;
        
        res.json({
            liked: likeIndex === -1,
            likesCount: listing.likesCount
        });
        
    } catch (error) {
        console.error('❌ Erreur toggle like:', error);
        res.status(500).json({
            message: "Erreur lors du like",
            error: error.message
        });
    }
};
