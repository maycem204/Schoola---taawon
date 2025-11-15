# Changelog - Schoola-Taawon

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

---

## [1.1.0] - 2024-11-07

### ✨ Ajouts

#### Système de notifications en temps réel
- **NotificationContext** (`client/src/context/NotificationContext.tsx`)
  - Gestion centralisée des notifications
  - Connexion Socket.IO pour les notifications en temps réel
  - Support de 3 types : messages, annonces, info
  - Snackbar automatique pour les nouvelles notifications
  - API complète : `addNotification`, `markAsRead`, `markAllAsRead`, `clearNotifications`

- **NotificationBell** (`client/src/components/NotificationBell.tsx`)
  - Composant de cloche avec badge de compteur
  - Menu déroulant avec liste des notifications
  - Formatage intelligent du temps relatif
  - Navigation vers les pages liées
  - Marquage automatique comme lu

#### Recherche avancée
- **AdvancedSearch** (`client/src/components/AdvancedSearch.tsx`)
  - Barre de recherche textuelle
  - Filtres pliables/dépliables
  - 7 catégories de fournitures scolaires
  - 4 états de condition
  - 24 villes tunisiennes
  - Slider de prix (0-1000 DT)
  - 4 options de tri
  - Chips de filtres actifs supprimables
  - Bouton "Effacer tout"

#### Validations de sécurité
- **validateMessage** (`server/middleware/validation.js`)
  - Validation du contenu (1-1000 caractères)
  - Protection contre les balises HTML
  - Validation de l'ID de conversation

- **validateConversation** (`server/middleware/validation.js`)
  - Validation de l'ID du destinataire
  - Validation optionnelle de l'ID de l'annonce

- **validateLogin** (`server/middleware/validation.js`)
  - Validation et normalisation de l'email
  - Vérification de la présence du mot de passe

#### Documentation
- **AMELIORATIONS.md** - Documentation complète des améliorations
- **GUIDE_UTILISATION.md** - Guide d'utilisation détaillé
- **CHANGELOG.md** - Ce fichier

### 🗑️ Suppressions

#### Fichiers obsolètes nettoyés
- `client/src/pages/Messages.new.tsx` - Version avec TODOs non implémentés
- `client/src/pages/Messages.new2.tsx` - Version intermédiaire obsolète
- `client/src/components/ListingCard.fixed.tsx` - Doublon du composant

### 🔧 Modifications

#### Intégration des nouveaux composants
- **App.tsx**
  - Ajout du `NotificationProvider` dans la hiérarchie
  - Nouvelle structure : `AuthProvider > NotificationProvider > ListingsProvider`

- **Navbar.tsx**
  - Ajout du composant `NotificationBell`
  - Affichage de l'icône de notifications avec badge

### 🔒 Sécurité

#### Améliorations existantes maintenues
- Protection XSS avec `xss-clean`
- Protection NoSQL injection avec `express-mongo-sanitize`
- En-têtes de sécurité avec `helmet`
- CORS configuré
- Rate limiting (100 requêtes/15min)
- Protection clickjacking
- Désactivation de `x-powered-by`

#### Nouvelles validations
- Validation stricte des messages
- Validation des conversations
- Validation du login

---

## [1.0.0] - Date initiale

### ✨ Fonctionnalités initiales

#### Authentification
- Inscription et connexion utilisateur
- JWT tokens
- Hashage bcrypt des mots de passe
- Routes protégées

#### Gestion des annonces
- Création, édition, suppression d'annonces
- Upload d'images (jusqu'à 5)
- Catégorisation
- Géolocalisation par ville
- Niveaux scolaires

#### Messagerie
- Socket.IO pour les messages en temps réel
- Conversations entre utilisateurs
- Indicateurs de messages non lus
- Marquage automatique comme lu
- Historique des conversations

#### Interface utilisateur
- Design Material-UI moderne
- Responsive (mobile, tablette, desktop)
- Thème personnalisé (violet/bleu)
- Navigation intuitive
- Footer avec informations

#### Backend
- API REST avec Express
- MongoDB avec Mongoose
- Upload de fichiers avec Multer
- Logs avec Winston
- Process management avec PM2

---

## Structure des versions

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

### Types de changements
- **✨ Ajouts** : Nouvelles fonctionnalités
- **🔧 Modifications** : Changements de fonctionnalités existantes
- **🗑️ Suppressions** : Fonctionnalités retirées
- **🐛 Corrections** : Corrections de bugs
- **🔒 Sécurité** : Améliorations de sécurité
- **📝 Documentation** : Changements de documentation
- **⚡ Performance** : Améliorations de performance

---

## Roadmap - Prochaines versions

### [1.2.0] - Prévu
- [ ] Système de notation et avis
- [ ] Upload multiple d'images amélioré
- [ ] Pagination des annonces
- [ ] Recherche full-text avec MongoDB Atlas
- [ ] Statistiques utilisateur avancées

### [1.3.0] - Prévu
- [ ] Système de signalement d'annonces
- [ ] Tableau de bord admin
- [ ] Modération de contenu
- [ ] Bannissement d'utilisateurs
- [ ] Logs d'audit

### [2.0.0] - Futur
- [ ] Mode sombre
- [ ] Support multilingue (Arabe/Français)
- [ ] Notifications push (PWA)
- [ ] Application mobile (React Native)
- [ ] Export des conversations en PDF
- [ ] Intégration paiement en ligne

---

## Notes de migration

### De 1.0.0 à 1.1.0

#### Changements requis

1. **Installation des dépendances**
   ```bash
   cd client
   npm install
   ```

2. **Aucune migration de base de données requise**
   - Les nouveaux champs sont optionnels
   - Compatibilité ascendante maintenue

3. **Variables d'environnement**
   - Aucune nouvelle variable requise
   - Configuration existante suffit

4. **Redémarrage des services**
   ```bash
   # Développement
   npm run dev
   
   # Production
   pm2 restart all
   ```

#### Changements optionnels

1. **Utiliser les nouvelles validations**
   - Importer les nouvelles validations dans vos routes
   - Exemple :
   ```javascript
   const { validateMessage, validate } = require('./middleware/validation');
   router.post('/messages', validateMessage, validate, messageController.sendMessage);
   ```

2. **Intégrer la recherche avancée**
   - Importer le composant `AdvancedSearch` dans vos pages
   - Exemple :
   ```typescript
   import AdvancedSearch from '../components/AdvancedSearch';
   <AdvancedSearch onSearch={handleSearch} />
   ```

#### Problèmes connus

- Aucun problème connu pour cette version

---

## Support

### Versions supportées

| Version | Support          | Fin de support |
|---------|------------------|----------------|
| 1.1.x   | ✅ Actif         | -              |
| 1.0.x   | ⚠️ Sécurité seule | 2025-01-07     |

### Rapporter un bug

1. Vérifiez que le bug n'a pas déjà été rapporté
2. Créez une issue sur GitHub avec :
   - Version de l'application
   - Étapes pour reproduire
   - Comportement attendu vs observé
   - Logs d'erreur
   - Captures d'écran si pertinent

---

## Contributeurs

- **Développeur principal** : [Votre nom]
- **Contributeurs** : Voir [CONTRIBUTORS.md](CONTRIBUTORS.md)

---

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

**Dernière mise à jour** : 7 novembre 2024
