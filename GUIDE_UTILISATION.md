# Guide d'utilisation - Schoola-Taawon

## 🚀 Démarrage rapide

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd schoola-taawon

# Installer les dépendances backend
cd server
npm install

# Installer les dépendances frontend
cd ../client
npm install
```

### Configuration

1. **Backend** - Créer `.env` dans `/server`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/schoola-taawon
JWT_SECRET=votre_secret_jwt_tres_securise
CLIENT_URL=http://localhost:3000
```

2. **Frontend** - Créer `.env` dans `/client`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Lancement

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

L'application sera accessible sur `http://localhost:3000`

---

## 📱 Nouvelles fonctionnalités

### 1. Système de notifications

#### Accès
- Cliquez sur l'icône 🔔 dans la barre de navigation (en haut à droite)
- Un badge rouge indique le nombre de notifications non lues

#### Fonctionnalités
- **Notifications en temps réel** : Recevez instantanément les nouveaux messages
- **Historique** : Consultez vos 10 dernières notifications
- **Marquage** : Cliquez sur "Tout marquer comme lu" pour effacer le badge
- **Navigation** : Cliquez sur une notification pour accéder à la page concernée

#### Types de notifications
- 💬 **Messages** : Nouveau message dans une conversation
- 📝 **Annonces** : Mise à jour d'une annonce que vous suivez
- ℹ️ **Info** : Informations système

---

### 2. Recherche avancée

#### Accès
- Page "Annonces" (`/listings`)
- La barre de recherche est en haut de la page

#### Utilisation

1. **Recherche textuelle**
   - Tapez votre recherche dans la barre
   - Appuyez sur Entrée ou cliquez sur "Rechercher"

2. **Filtres avancés**
   - Cliquez sur l'icône de filtre (☰) pour afficher les options
   - Sélectionnez vos critères :
     - **Catégorie** : Livres, Cahiers, Stylos, etc.
     - **État** : Neuf, Comme neuf, Bon état, etc.
     - **Ville** : Sélectionnez parmi 24 villes tunisiennes
     - **Prix** : Utilisez le slider pour définir une fourchette
     - **Tri** : Plus récent, Prix croissant/décroissant, Populaire

3. **Gestion des filtres**
   - Les filtres actifs s'affichent sous forme de chips
   - Cliquez sur ❌ sur un chip pour le retirer
   - Cliquez sur "Effacer tout" pour réinitialiser tous les filtres

#### Exemples de recherche

**Recherche simple :**
```
"calculatrice scientifique"
```

**Recherche avec filtres :**
- Catégorie: Calculatrices
- État: Neuf
- Ville: Tunis
- Prix: 50-200 DT
- Tri: Prix croissant

---

## 💬 Messagerie

### Démarrer une conversation

1. Accédez à une annonce
2. Cliquez sur "Contacter le vendeur"
3. Vous serez redirigé vers la page Messages avec la conversation ouverte

### Utiliser la messagerie

#### Interface
- **Panneau gauche** : Liste des conversations
  - Badge bleu : Conversation avec messages non lus
  - Bordure bleue : Indication visuelle de messages non lus
- **Panneau droit** : Messages de la conversation sélectionnée

#### Fonctionnalités
- **Messages en temps réel** : Les messages arrivent instantanément via Socket.IO
- **Marquage automatique** : Les messages sont marqués comme lus quand vous ouvrez la conversation
- **Scroll automatique** : La conversation défile automatiquement vers le bas
- **Indicateur de conversation** : Le titre de l'annonce est affiché en sous-titre

#### Envoyer un message
1. Tapez votre message dans le champ en bas
2. Appuyez sur Entrée ou cliquez sur l'icône d'envoi (✉️)
3. Le message apparaît instantanément dans la conversation

---

## 📝 Gestion des annonces

### Créer une annonce

1. Connectez-vous à votre compte
2. Cliquez sur "Publier" dans la navigation
3. Remplissez le formulaire :
   - **Titre** : 3-100 caractères
   - **Description** : 10-1000 caractères
   - **Catégorie** : Sélectionnez dans la liste
   - **État** : Neuf, Comme neuf, Bon état, État acceptable
   - **Prix** : En dinars tunisiens
   - **Niveau scolaire** : Primaire, Collège, Lycée, Université
   - **Ville** : Votre localisation
   - **Images** : Jusqu'à 5 photos
4. Cliquez sur "Publier l'annonce"

### Modifier une annonce

1. Accédez à votre profil
2. Trouvez l'annonce dans "Mes annonces"
3. Cliquez sur "Modifier"
4. Effectuez vos modifications
5. Cliquez sur "Enregistrer les modifications"

### Supprimer une annonce

1. Accédez à votre profil
2. Trouvez l'annonce dans "Mes annonces"
3. Cliquez sur "Supprimer"
4. Confirmez la suppression

---

## 👤 Profil utilisateur

### Accès
- Cliquez sur votre avatar en haut à droite
- Sélectionnez "Mon profil"

### Sections disponibles

#### Mes annonces
- Visualisez toutes vos annonces publiées
- Modifiez ou supprimez vos annonces
- Consultez les statistiques (vues, messages)

#### Informations personnelles
- Nom d'utilisateur
- Email
- Ville
- Date d'inscription

#### Modifier le profil
- Changez votre nom d'utilisateur
- Mettez à jour votre ville
- Modifiez votre mot de passe

---

## ⭐ Favoris

### Ajouter aux favoris
1. Sur une annonce, cliquez sur l'icône ❤️
2. L'annonce est ajoutée à vos favoris
3. L'icône devient rouge

### Consulter les favoris
1. Cliquez sur "Favoris" dans la navigation
2. Visualisez toutes vos annonces favorites
3. Cliquez sur une annonce pour voir les détails

### Retirer des favoris
- Cliquez à nouveau sur l'icône ❤️ rouge
- L'annonce est retirée de vos favoris

---

## 🔒 Sécurité et confidentialité

### Bonnes pratiques

#### Lors de la création de compte
- ✅ Utilisez un mot de passe fort (min. 6 caractères)
- ✅ Utilisez une adresse email valide
- ✅ Ne partagez jamais votre mot de passe

#### Lors de la publication d'annonces
- ✅ Soyez honnête sur l'état des articles
- ✅ Utilisez des photos réelles
- ✅ Fixez des prix raisonnables
- ❌ Ne partagez pas d'informations personnelles sensibles

#### Lors des échanges
- ✅ Utilisez la messagerie intégrée
- ✅ Rencontrez-vous dans des lieux publics
- ✅ Vérifiez l'état des articles avant l'achat
- ❌ Ne payez jamais à l'avance sans voir l'article

### Protection des données
- Vos mots de passe sont hashés avec bcrypt
- Les communications sont protégées par HTTPS (en production)
- Protection contre les injections XSS et NoSQL
- Rate limiting pour prévenir les abus

---

## 🆘 Dépannage

### Problèmes courants

#### "Impossible de se connecter"
- Vérifiez que le backend est démarré (`npm run dev` dans `/server`)
- Vérifiez que MongoDB est en cours d'exécution
- Vérifiez vos identifiants

#### "Les messages ne s'affichent pas en temps réel"
- Vérifiez que Socket.IO est connecté (console du navigateur)
- Rafraîchissez la page
- Vérifiez votre connexion internet

#### "Les images ne s'affichent pas"
- Vérifiez que le dossier `/server/uploads` existe
- Vérifiez les permissions du dossier
- Vérifiez la taille des images (max 5MB)

#### "Erreur 500 lors de la recherche"
- Vérifiez que MongoDB est accessible
- Consultez les logs du serveur
- Vérifiez la connexion à la base de données

### Logs et débogage

#### Backend
```bash
# Logs en temps réel
cd server
npm run dev

# Logs PM2 (production)
pm2 logs schoola-taawon-server
```

#### Frontend
- Ouvrez la console du navigateur (F12)
- Onglet "Console" pour les erreurs JavaScript
- Onglet "Network" pour les requêtes API

---

## 📊 Statistiques et monitoring

### En développement
- Logs console dans le terminal
- React DevTools pour le frontend
- MongoDB Compass pour la base de données

### En production
```bash
# Monitoring PM2
pm2 monit

# Logs
pm2 logs

# Statut
pm2 status
```

---

## 🔄 Mises à jour

### Vérifier les mises à jour
```bash
# Backend
cd server
npm outdated

# Frontend
cd client
npm outdated
```

### Installer les mises à jour
```bash
# Backend
cd server
npm update

# Frontend
cd client
npm update
```

---

## 📞 Support

### Ressources
- 📖 Documentation complète : `README.md`
- 🔧 Améliorations : `AMELIORATIONS.md`
- 🐛 Issues : Créez une issue sur GitHub

### Contact
- Email : support@schoola-taawon.tn (à configurer)
- Discord : (à configurer)

---

## 🎯 Conseils d'utilisation

### Pour les vendeurs
1. **Photos de qualité** : Prenez des photos claires et bien éclairées
2. **Descriptions détaillées** : Mentionnez l'état, l'année, les défauts éventuels
3. **Prix justes** : Consultez les prix du marché
4. **Réactivité** : Répondez rapidement aux messages
5. **Honnêteté** : Soyez transparent sur l'état des articles

### Pour les acheteurs
1. **Recherche efficace** : Utilisez les filtres pour affiner vos résultats
2. **Vérification** : Posez des questions sur l'état de l'article
3. **Négociation** : N'hésitez pas à négocier poliment
4. **Sécurité** : Rencontrez le vendeur dans un lieu public
5. **Feedback** : (À venir) Laissez des avis pour aider la communauté

---

## 🚀 Prochaines fonctionnalités

### En développement
- [ ] Système de notation et avis
- [ ] Notifications push (PWA)
- [ ] Mode sombre
- [ ] Support multilingue (Arabe)
- [ ] Application mobile

### Proposez vos idées
Vous avez des suggestions ? Créez une issue sur GitHub avec le tag "enhancement"

---

**Bonne utilisation de Schoola-Taawon ! 📚**
