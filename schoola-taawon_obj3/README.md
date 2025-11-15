# 📚 Schoola-Taawon - Livrable Objectif 3

## Groupe : [Votre Groupe]

## Membres de l'équipe :
- [Nom Prénom] - [Rôle]
- [Nom Prénom] - [Rôle]
- [Nom Prénom] - [Rôle]

---

## 🎯 Objectif 3 : Développement Concret

### Contexte
Suite à la définition de la structure (sitemap), à la conception des prototypes et à la validation du design (Objectif 2), nous avons passé à la phase de développement concret. Cette étape consiste à traduire nos maquettes en un site fonctionnel à l'aide du framework choisi et à implémenter les fonctionnalités essentielles répondant aux besoins définis lors de l'Objectif 1.

---

## 🏗️ Choix du Framework

### Framework Frontend : React + TypeScript

**Justification détaillée du choix :**

**1. Composants Réutilisables et Maintenabilité**
- React permet de créer des composants modulaires qui peuvent être réutilisés dans différentes parties de l'application
- La structure en composants facilite la maintenance et l'évolution du code
- Possibilité de créer une bibliothèque de composants partagés

**2. TypeScript pour la Sécurité et la Productivité**
- Typage statique qui réduit les erreurs à l'exécution
- Autocomplétion et IntelliSense améliorés dans l'IDE
- Meilleure expérience développeur avec détection précoce des erreurs
- Documentation automatique du code via les types

**3. Écosystème Riche et Mature**
- Material-UI (MUI) : Framework UI complet avec composants prêts à l'emploi
- React Router : Gestion avancée de la navigation
- Axios : Bibliothèque HTTP robuste pour les appels API
- Socket.IO Client : Support natif du temps réel

**4. Performance Optimisée**
- Virtual DOM qui minimise les manipulations directes du DOM réel
- Optimisations automatiques (code splitting, lazy loading)
- Possibilité d'optimisations avancées (memoization, etc.)

**5. Communauté Active et Support**
- Énorme communauté de développeurs
- Nombreuses ressources, tutoriels et bibliothèques
- Mises à jour régulières et support long terme
- Adoption massive dans l'industrie

**6. Adapté à notre Projet**
- Idéal pour une application monopage (SPA) avec navigation fluide
- Gestion d'état complexe avec Context API ou Redux
- Intégration facile avec des API REST et WebSocket

### Framework Backend : Node.js + Express

**Justification détaillée du choix :**

**1. JavaScript Full-Stack**
- Même langage pour le frontend et le backend
- Équipe peut travailler sur les deux parties
- Partage de connaissances et de compétences
- Réduction de la complexité du projet

**2. Express.js : Framework Léger et Flexible**
- Framework minimaliste qui n'impose pas de structure rigide
- Grande liberté dans l'organisation du code
- Performance élevée avec faible overhead
- Middleware extensible pour ajouter des fonctionnalités

**3. Écosystème NPM**
- Plus de 1 million de paquets disponibles
- Gestionnaire de dépendances robuste
- Outils de développement matures (nodemon, PM2)
- Scripts d'automatisation faciles

**4. Support Natif du Temps Réel**
- Socket.IO intégré nativement à Node.js
- Gestion facile des connexions WebSocket
- Évolutivité pour les fonctionnalités temps réel

**5. Base de Données MongoDB**
- NoSQL adapté aux données flexibles et évolutives
- Mongoose pour la modélisation des données
- Intégration facile avec Node.js
- Performance pour les opérations CRUD

**6. Sécurité et Performance**
- Middleware de sécurité (Helmet, CORS, rate limiting)
- Gestion des sessions et authentification JWT
- Upload de fichiers sécurisé avec Multer
- Validation des données avec express-validator

**7. Déploiement et Maintenance**
- PM2 pour la gestion des processus en production
- Logs structurés avec Winston
- Sauvegarde automatique de la base de données
- Monitoring et supervision

---

## 📋 Fonctionnalités Développées

### ✅ 1. Authentification et Gestion des Utilisateurs
- **Inscription complète** : Formulaire avec username, email, password, ville, photo de profil optionnelle
- **Validation côté client et serveur** : Contrôles en temps réel et sécurisation des données
- **Connexion sécurisée** : JWT avec session persistante
- **Gestion du profil** : Modification des informations personnelles

### ✅ 2. Gestion des Annonces
- **Consultation publique** : Liste des annonces avec filtrage par catégorie, niveau, ville
- **Publication authentifiée** : Formulaire détaillé avec upload de photos (max 5)
- **Gestion propriétaire** : Modification et suppression uniquement par le créateur
- **Détails riches** : Page dédiée avec toutes les informations

### ✅ 3. Messagerie en Temps Réel
- **Socket.IO intégré** : Communication instantanée entre utilisateurs
- **Conversations privées** : Démarrage depuis les annonces
- **Interface moderne** : Distinction visuelle envoi/réception
- **Indicateurs visuels** : Messages non lus en évidence

### ✅ 4. Système de Favoris
- **Interaction intuitive** : Cœur cliquable sur chaque annonce
- **Stockage local** : Persistance des favoris côté client
- **Page dédiée** : Consultation centralisée des favoris

---

## 🗂️ Structure du Projet

```
schoola-taawon_obj3/
├── client/                          # Frontend React + TypeScript
│   ├── public/                      # Assets statiques (favicon, manifest)
│   ├── src/
│   │   ├── components/              # Composants réutilisables
│   │   │   ├── Navbar.tsx          # Navigation principale
│   │   │   ├── ListingCard.tsx     # Carte d'annonce
│   │   │   └── Layout.tsx          # Structure de base
│   │   ├── pages/                   # Pages de l'application
│   │   │   ├── Home.tsx            # Page d'accueil
│   │   │   ├── Listings.tsx        # Liste des annonces
│   │   │   ├── CreateListing.tsx   # Création d'annonce
│   │   │   ├── Login.tsx           # Connexion
│   │   │   ├── Register.tsx        # Inscription
│   │   │   └── Messages.tsx        # Messagerie
│   │   ├── context/                 # Gestion d'état globale
│   │   │   ├── AuthContext.tsx     # Authentification
│   │   │   └── ListingsContext.tsx # Gestion annonces
│   │   ├── services/                # Appels API
│   │   │   ├── auth.service.ts
│   │   │   └── listing.service.ts
│   │   ├── types/                   # Interfaces TypeScript
│   │   └── App.tsx                  # Application principale
│   ├── package.json                 # Dépendances frontend
│   └── tsconfig.json                # Configuration TypeScript
├── server/                          # Backend Node.js + Express
│   ├── controllers/                 # Logique métier
│   │   ├── auth.controller.js       # Authentification
│   │   ├── listing.controller.js    # Gestion annonces
│   │   └── message.controller.js    # Messagerie
│   ├── models/                      # Modèles de données
│   │   ├── User.js                  # Utilisateur
│   │   ├── Listing.js               # Annonce
│   │   ├── Message.js               # Message
│   │   └── Conversation.js          # Conversation
│   ├── routes/                      # Définition des routes API
│   │   ├── auth.js                  # Routes auth
│   │   ├── listings.js              # Routes annonces
│   │   └── messages.js              # Routes messagerie
│   ├── middleware/                  # Middleware personnalisés
│   │   ├── auth.js                  # Vérification JWT
│   │   ├── upload.js                # Gestion upload
│   │   └── validation.js            # Validation données
│   ├── config/                      # Configuration
│   ├── index.js                     # Point d'entrée serveur
│   └── package.json                 # Dépendances backend
├── README.md                        # Documentation (ce fichier)
└── start-app.bat                    # Script de démarrage
```

---

## 🚀 Étapes de Lancement du Projet

### Prérequis Système
- **Node.js** : Version 16 ou supérieure (runtime JavaScript)
- **MongoDB** : Base de données NoSQL (local ou MongoDB Atlas)
- **npm** : Gestionnaire de paquets (inclus avec Node.js)
- **Navigateur moderne** : Chrome, Firefox, Edge ou Safari

### Installation Détaillée

#### 1. Récupération du Code Source
```bash
# Clonage du repository Git
git clone [URL_DU_REPOSITORY_GITHUB]
cd schoola-taawon_obj3
```

#### 2. Installation des Dépendances Backend
```bash
# Navigation vers le dossier serveur
cd server

# Installation des paquets npm
npm install

# Cette commande installe tous les paquets listés dans package.json :
# - express (framework web)
# - mongoose (ODM MongoDB)
# - bcryptjs (hashage mots de passe)
# - jsonwebtoken (JWT)
# - socket.io (temps réel)
# - multer (upload fichiers)
# - etc.
```

#### 3. Installation des Dépendances Frontend
```bash
# Navigation vers le dossier client
cd ../client

# Installation des paquets npm
npm install

# Cette commande installe :
# - react (bibliothèque UI)
# - react-dom (rendu DOM)
# - @mui/material (composants UI)
# - axios (requêtes HTTP)
# - react-router-dom (navigation)
# - socket.io-client (client temps réel)
# - typescript (surensemble JavaScript)
```

#### 4. Configuration de l'Environnement
```bash
# Dans le dossier server/
# Création du fichier de configuration
cp .env.example .env

# Édition du fichier .env avec :
# - MONGODB_URI : URL de connexion MongoDB
# - JWT_SECRET : Clé secrète pour JWT
# - PORT : Port du serveur (5001)
# - NODE_ENV : development/production
```

#### 5. Démarrage de MongoDB
```bash
# Pour MongoDB local
./start-mongodb.bat

# Ou configuration MongoDB Atlas pour le cloud
```

#### 6. Démarrage du Serveur Backend
```bash
cd server
npm run dev  # Mode développement avec nodemon
# ou
npm start    # Mode production
```

#### 7. Démarrage du Client Frontend
```bash
cd client
npm start    # Démarre le serveur de développement React
```

### Accès à l'Application
- **Interface utilisateur** : http://localhost:3000
- **API Backend** : http://localhost:5001
- **Documentation API** : http://localhost:5001/api/docs (si Swagger configuré)

---

## 🧪 Tests et Validation

### Tests Fonctionnels Utilisateur

#### Authentification
- ✅ Création de compte avec données valides
- ✅ Connexion avec identifiants corrects
- ✅ Redirection automatique après connexion
- ✅ Persistance de la session

#### Gestion des Annonces
- ✅ Consultation des annonces sans connexion
- ✅ Filtrage par catégorie et ville
- ✅ Publication d'annonce avec photos
- ✅ Modification/suppression de ses propres annonces uniquement

#### Messagerie
- ✅ Démarrage de conversation depuis annonce
- ✅ Envoi et réception de messages
- ✅ Indicateurs de messages non lus
- ✅ Marquage automatique comme lu

#### Favoris
- ✅ Ajout/retrait de favoris
- ✅ Affichage dans page dédiée
- ✅ Persistance des données

### Tests Techniques

#### Compatibilité Navigateurs
- ✅ Google Chrome (dernière version)
- ✅ Mozilla Firefox (dernière version)
- ✅ Microsoft Edge (dernière version)
- ✅ Safari (dernière version)

#### Tests de Performance
- ✅ Temps de chargement < 3 secondes
- ✅ Taille bundle optimisée
- ✅ Images compressées automatiquement

#### Tests de Sécurité
- ✅ Tentatives d'accès non autorisé bloquées
- ✅ Validation des données d'entrée
- ✅ Protection contre les injections

---

## 🔒 Sécurité Implémentée

### Authentification et Autorisation
- **JWT (JSON Web Tokens)** : Tokens sécurisés avec expiration
- **Hashage des mots de passe** : bcrypt avec salt rounds
- **Sessions persistantes** : Stockage sécurisé côté client

### Validation des Données
- **express-validator** : Validation côté serveur
- **Types TypeScript** : Validation côté client
- **Sanitisation** : Nettoyage des entrées utilisateur

### Protection contre les Attaques
- **Helmet** : Headers de sécurité HTTP
- **CORS** : Configuration des origines autorisées
- **Rate Limiting** : Limitation du nombre de requêtes
- **XSS Protection** : Prévention des attaques XSS

### Sécurité des Fichiers
- **Multer** : Upload sécurisé avec validation
- **Types MIME** : Vérification des formats de fichiers
- **Taille limitée** : Contrôle de la taille des uploads

---

## 📱 Fonctionnalités Responsive

### Breakpoints Définis
- **Mobile** : < 768px
- **Tablette** : 768px - 1024px
- **Desktop** : > 1024px

### Adaptations Implémentées
- **Navigation** : Menu hamburger sur mobile
- **Grille d'annonces** : 1 colonne mobile, 2 tablette, 3 desktop
- **Formulaires** : Champs adaptés à la taille d'écran
- **Images** : Redimensionnement automatique

---

## 🎨 Design et UX

### Framework UI : Material-UI (MUI)

**Justification du choix :**
- **Design System Cohérent** : Google Material Design
- **Composants Accessibles** : Conformité WCAG
- **Thème Personnalisable** : Adaptation à notre charte
- **Responsive par Défaut** : Adapté tous supports
- **Documentation Complète** : Facilite l'intégration

### Palette de Couleurs
- **Primaire** : #1976d2 (Bleu éducatif)
- **Secondaire** : #388e3c (Vert réussite)
- **Accent** : #ff9800 (Orange motivation)

---

## 📊 Base de Données et Gestion des Données

### Choix de l'Architecture des Données
Conformément aux exigences de l'Objectif 1, nous avons choisi de **créer un backend minimal** plutôt que de consommer une API REST existante. Cette approche nous permet :
- **Contrôle total** sur les données et la logique métier
- **Personnalisation** des fonctionnalités selon nos besoins spécifiques
- **Évolutivité** pour les futures améliorations
- **Sécurité** renforcée avec notre propre implémentation

### Architecture MongoDB
- **NoSQL Document-Based** : Adapté aux données flexibles et évolutives
- **Collections Principales** :
  - `users` : Profils utilisateurs avec authentification
  - `listings` : Annonces avec métadonnées et photos
  - `conversations` : Gestion des discussions privées
  - `messages` : Contenu des messages avec timestamps

### API REST Propriétaire
- **Routes RESTful** : GET, POST, PUT, DELETE pour chaque ressource
- **Authentification JWT** : Sécurisation des endpoints
- **Validation** : Contrôle des données en entrée/sortie
- **Middleware** : Gestion des erreurs, logs, sécurité

### Optimisations
- **Index MongoDB** : Requêtes optimisées sur les champs fréquents
- **Agrégations** : Calculs statistiques efficaces
- **Références** : Relations optimisées entre documents
- **Cache** : Amélioration des performances

---

## 👥 Collaboration et Méthodologie

### Outils de Gestion
- **Git/GitHub** : Versioning et collaboration
- **Trello/Notion** : Suivi des tâches
- **Discord** : Communication équipe

### Méthodologie Agile
- **Sprints Hebdomadaires** : Développement itératif
- **Code Review** : Validation collective
- **Documentation** : Mise à jour continue

---

## 📞 Support et Maintenance

### Équipe Technique
- **Lead Developer** : [Nom] - Développement full-stack
- **Frontend Developer** : [Nom] - Interface utilisateur
- **Backend Developer** : [Nom] - API et base de données

### Scripts de Maintenance
- **Sauvegarde** : `server/scripts/backup.js`
- **Initialisation** : `server/scripts/init-database.js`
- **Monitoring** : PM2 et logs Winston

---

## 🎯 Points Clés Atteints

### Objectif 3 - Développement Concret
- ✅ **Site fonctionnel** avec 5+ pages dynamiques
- ✅ **Frontend complet** basé sur React + TypeScript
- ✅ **Backend opérationnel** avec API REST
- ✅ **Fonctionnalités essentielles** implémentées
- ✅ **Sécurité et performance** assurées
- ✅ **Documentation technique** fournie

---

**Date de soumission :** [Date du jour]
**Version :** 1.0.0 - Objectif 3
**Statut :** ✅ Prêt pour évaluation

---

*Ce livrable démontre la mise en place concrète de l'architecture technique choisie et l'implémentation des fonctionnalités de base de la plateforme Schoola-Taawon.*
