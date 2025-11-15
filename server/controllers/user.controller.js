const User = require('../models/User');

// Mettre à jour le profil utilisateur
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { address, phone, bio } = req.body;
    
    const updateData = {};
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    
    // Si une photo de profil est uploadée
    if (req.file) {
      updateData.profilePicture = req.file.filename;
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json({
      message: 'Profil mis à jour avec succès',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        city: user.city,
        address: user.address,
        phone: user.phone,
        profilePicture: user.profilePicture,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir le profil utilisateur
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        city: user.city,
        address: user.address,
        phone: user.phone,
        profilePicture: user.profilePicture,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
