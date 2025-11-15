const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['textbooks', 'notebooks', 'stationery', 'electronics', 'other']
    },
    condition: {
        type: String,
        required: true,
        enum: ['new', 'like_new', 'good', 'fair']
    },
    educationLevel: {
        type: String,
        required: true,
        enum: ['primary', 'middle', 'high', 'university']
    },
    universityDetails: {
        university: String,
        faculty: String,
        degree: {
            type: String,
            enum: ['prepa', 'licence', 'ingenieur', 'master', 'doctorat']
        }
    },
    city: {
        type: String,
        required: true
    },
    district: {
        type: String
    },
    listingType: {
        type: String,
        required: true,
        enum: ['vente', 'echange', 'don', 'sale', 'exchange', 'donation']
    },
    price: {
        type: Number,
        default: 0
    },
    estimatedValue: {
        type: Number,
        default: 0
    },
    images: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['disponible', 'en_echange', 'echange_termine', 'expire'],
        default: 'disponible'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Système de likes
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likesCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);