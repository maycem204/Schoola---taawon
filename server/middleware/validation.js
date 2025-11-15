const { body, validationResult } = require('express-validator');

const validateUser = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email invalide'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('city')
        .trim()
        .notEmpty()
        .withMessage('La ville est requise')
];

const validateListing = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Le titre doit contenir entre 3 et 100 caractères'),
    body('description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('La description doit contenir entre 10 et 1000 caractères'),
    body('category')
        .isIn(['textbooks', 'notebooks', 'stationery', 'electronics', 'other'])
        .withMessage('Catégorie invalide'),
    body('condition')
        .isIn(['new', 'like_new', 'good', 'fair'])
        .withMessage('État invalide'),
    body('educationLevel')
        .notEmpty()
        .withMessage('Niveau scolaire requis'),
    body('universityName')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Le nom de l\'université ne doit pas dépasser 100 caractères'),
    body('universityCycle')
        .optional()
        .isIn(['', 'prepa', 'licence', 'master', 'doctorat', 'ingenieur'])
        .withMessage('Cycle universitaire invalide'),
    body('universityDomain')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Le domaine d\'études ne doit pas dépasser 100 caractères'),
    body('city')
        .trim()
        .notEmpty()
        .withMessage('Ville requise'),
    body('exchangeType')
        .isIn(['sale', 'exchange', 'donation'])
        .withMessage('Type d\'échange invalide'),
    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Le prix doit être un nombre positif'),
    body('estimatedValue')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('La valeur estimée doit être un nombre positif')
];

const validateMessage = [
    body('content')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Le message doit contenir entre 1 et 1000 caractères')
        .matches(/^[^<>]*$/)
        .withMessage('Le message contient des caractères non autorisés'),
    body('conversationId')
        .notEmpty()
        .isMongoId()
        .withMessage('ID de conversation invalide')
];

const validateConversation = [
    body('recipientId')
        .notEmpty()
        .isMongoId()
        .withMessage('ID du destinataire invalide'),
    body('listingId')
        .optional()
        .isMongoId()
        .withMessage('ID de l\'annonce invalide')
];

const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email invalide'),
    body('password')
        .notEmpty()
        .withMessage('Le mot de passe est requis')
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateUser,
    validateListing,
    validateMessage,
    validateConversation,
    validateLogin,
    validate
};