# Schoola-Taawon 📚

## Description
Plateforme d'échange de fournitures scolaires pour les étudiants tunisiens.

## Fonctionnalités principales
- 👥 Authentification des utilisateurs
- 📝 Publication et recherche d'annonces
- 💬 Messagerie en temps réel
- 🔍 Filtrage par catégorie, ville, etc.
- 📸 Gestion des images

## Prérequis
- Node.js (v16+)
- MongoDB
- npm ou yarn

## Installation

### Backend (./server)
```bash
cd server
npm install
cp .env.example .env # Configurer les variables d'environnement
npm run dev # Pour le développement
npm start # Pour la production
```

### Frontend (./client)
```bash
cd client
npm install
npm start # Lance le serveur de développement
npm run build # Pour la production
```

## Structure du projet

### Backend
- `/controllers` - Logique métier
- `/models` - Modèles de données MongoDB
- `/routes` - Routes de l'API
- `/middleware` - Middleware (auth, upload, etc.)
- `/uploads` - Stockage des fichiers uploadés

### Frontend
- `/src/components` - Composants React réutilisables
- `/src/pages` - Pages/Routes principales
- `/src/context` - Context providers React
- `/src/services` - Services API
- `/src/types` - Types TypeScript

## Tests
```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

## Déploiement
1. Configurer les variables d'environnement de production
2. Construire le frontend : `cd client && npm run build`
3. Installer PM2 : `npm install -g pm2`
4. Démarrer avec PM2 : `pm2 start ecosystem.config.json --env production`

## Sécurité
- Authentification JWT
- Validation des données
- Upload sécurisé des fichiers
- Protection CORS
- Rate limiting

## Maintenance
- Logs : `/var/log/schoola-taawon/`
- Monitoring : `pm2 monit`
- Backup MongoDB : Configuré avec cron

## Contribution
1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit les changements (`git commit -am 'Ajoute une amélioration'`)
4. Push la branche (`git push origin feature/amelioration`)
5. Créer une Pull Request

## License
MIT