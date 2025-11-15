const Listing = require('../models/Listing');
const Notification = require('../models/Notification');

// Liker/Unliker une annonce
exports.toggleLike = async (req, res) => {
    try {
        const { listingId } = req.params;
        const userId = req.user.userId;

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }

        // Vérifier si l'utilisateur a déjà liké
        const hasLiked = listing.likes.includes(userId);

        if (hasLiked) {
            // Retirer le like
            listing.likes.pull(userId);
            listing.likesCount = Math.max(0, listing.likesCount - 1);
        } else {
            // Ajouter le like
            listing.likes.push(userId);
            listing.likesCount += 1;

            // Créer une notification pour le propriétaire (sauf si c'est lui-même)
            if (listing.owner.toString() !== userId) {
                console.log('🔔 Création notification de like');
                console.log('   Propriétaire:', listing.owner.toString());
                console.log('   Likeur:', userId);
                console.log('   Annonce:', listing.title);
                
                const notification = new Notification({
                    recipient: listing.owner,
                    sender: userId,
                    type: 'like',
                    title: '❤️ Quelqu\'un a aimé votre annonce',
                    message: `Votre annonce "${listing.title}" a reçu un nouveau like !`,
                    relatedListing: listingId
                });
                await notification.save();
                
                console.log('✅ Notification sauvegardée:', notification._id);

                // Émettre via Socket.IO
                const io = req.app.get('io');
                if (io) {
                    io.to(listing.owner.toString()).emit('new_notification', notification);
                    console.log('📡 Notification émise vers room:', listing.owner.toString());
                } else {
                    console.error('❌ IO non disponible!');
                }
            } else {
                console.log('⚠️ Pas de notification (c\'est le propriétaire qui like)');
            }
        }

        await listing.save();

        res.json({
            liked: !hasLiked,
            likesCount: listing.likesCount
        });
    } catch (error) {
        console.error('Erreur toggle like:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Obtenir les likes d'une annonce
exports.getListingLikes = async (req, res) => {
    try {
        const { listingId } = req.params;
        const userId = req.user.userId;

        const listing = await Listing.findById(listingId)
            .populate('likes', 'username profilePicture');

        if (!listing) {
            return res.status(404).json({ message: 'Annonce non trouvée' });
        }

        res.json({
            likes: listing.likes,
            likesCount: listing.likesCount,
            hasLiked: listing.likes.some(like => like._id.toString() === userId)
        });
    } catch (error) {
        console.error('Erreur get likes:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
