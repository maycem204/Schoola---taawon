const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Configuration de base de la sécurité
const securityConfig = {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    },
    rateLimiter: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limite chaque IP à 100 requêtes par windowMs
    },
    helmet: {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'", 'https://api.schoola-taawon.com']
            }
        }
    }
};

// Middleware de sécurité
const setupSecurity = (app) => {
    // Protection contre les attaques XSS
    app.use(xss());

    // Protection contre l'injection NoSQL
    app.use(mongoSanitize());

    // En-têtes de sécurité
    app.use(helmet(securityConfig.helmet));

    // Configuration CORS
    app.use(cors(securityConfig.cors));

    // Rate limiting
    app.use('/api/', rateLimit(securityConfig.rateLimiter));

    // Protection contre le clickjacking
    app.use((req, res, next) => {
        res.setHeader('X-Frame-Options', 'DENY');
        next();
    });

    // Désactiver les en-têtes qui peuvent révéler des informations sur le serveur
    app.disable('x-powered-by');

    return app;
};

module.exports = setupSecurity;