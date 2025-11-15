# Tests rapides - Nouvelles fonctionnalités

Ce guide vous permet de tester rapidement toutes les nouvelles fonctionnalités ajoutées.

---

## ✅ Checklist de test

### 1. Système de notifications

#### Test 1.1 : Affichage de la cloche
- [ ] La cloche de notification apparaît dans la navbar (en haut à droite)
- [ ] La cloche est visible uniquement quand on est connecté
- [ ] Le badge est caché quand il n'y a pas de notifications

#### Test 1.2 : Menu des notifications
- [ ] Cliquer sur la cloche ouvre le menu
- [ ] Le menu affiche "Aucune notification" au début
- [ ] Le bouton "Tout marquer comme lu" n'apparaît pas quand il n'y a pas de notifications

#### Test 1.3 : Notifications de messages (nécessite 2 utilisateurs)
**Utilisateur A :**
1. [ ] Se connecter
2. [ ] Aller sur une annonce d'un autre utilisateur
3. [ ] Cliquer sur "Contacter le vendeur"
4. [ ] Envoyer un message

**Utilisateur B (vendeur) :**
1. [ ] Vérifier que la cloche affiche un badge rouge
2. [ ] Ouvrir le menu des notifications
3. [ ] Vérifier qu'une notification "Nouveau message" apparaît
4. [ ] Cliquer sur la notification
5. [ ] Vérifier la redirection vers la page Messages
6. [ ] Vérifier que le badge disparaît

#### Test 1.4 : Snackbar
- [ ] Une notification toast apparaît en haut à droite
- [ ] Le toast se ferme automatiquement après 6 secondes
- [ ] On peut fermer le toast manuellement avec le X

---

### 2. Recherche avancée

#### Test 2.1 : Barre de recherche
- [ ] Aller sur la page "Annonces" (`/listings`)
- [ ] La barre de recherche est visible en haut
- [ ] Taper "livre" et appuyer sur Entrée
- [ ] Les résultats se filtrent

#### Test 2.2 : Bouton de filtres
- [ ] Cliquer sur l'icône de filtre (☰)
- [ ] Les filtres se déplient
- [ ] Cliquer à nouveau, les filtres se replient

#### Test 2.3 : Filtre par catégorie
- [ ] Ouvrir les filtres
- [ ] Sélectionner "Livres" dans Catégorie
- [ ] Un chip "Catégorie: Livres" apparaît
- [ ] Les résultats se filtrent

#### Test 2.4 : Filtre par état
- [ ] Sélectionner "Neuf" dans État
- [ ] Un chip "État: Neuf" apparaît
- [ ] Les résultats se filtrent

#### Test 2.5 : Filtre par ville
- [ ] Sélectionner "Tunis" dans Ville
- [ ] Un chip "Ville: Tunis" apparaît
- [ ] Les résultats se filtrent

#### Test 2.6 : Slider de prix
- [ ] Déplacer le slider de gauche à 50
- [ ] Déplacer le slider de droite à 500
- [ ] Le texte affiche "Prix: 50 DT - 500 DT"
- [ ] Un chip "Prix: 50-500 DT" apparaît
- [ ] Les résultats se filtrent

#### Test 2.7 : Tri
- [ ] Sélectionner "Prix croissant"
- [ ] Les résultats se trient par prix croissant
- [ ] Sélectionner "Prix décroissant"
- [ ] Les résultats se trient par prix décroissant

#### Test 2.8 : Suppression de filtres
- [ ] Cliquer sur le X d'un chip
- [ ] Le filtre est retiré
- [ ] Les résultats se mettent à jour

#### Test 2.9 : Effacer tout
- [ ] Appliquer plusieurs filtres
- [ ] Cliquer sur "Effacer tout"
- [ ] Tous les filtres sont retirés
- [ ] Les chips disparaissent

#### Test 2.10 : Combinaison de filtres
- [ ] Appliquer : Catégorie "Livres" + Ville "Tunis" + Prix 0-100
- [ ] Vérifier que les 3 chips apparaissent
- [ ] Vérifier que les résultats respectent tous les critères

---

### 3. Validations de sécurité

#### Test 3.1 : Validation des messages
**Test du contenu vide :**
- [ ] Aller dans Messages
- [ ] Essayer d'envoyer un message vide
- [ ] Le bouton d'envoi est désactivé

**Test du contenu trop long :**
- [ ] Taper un message de plus de 1000 caractères
- [ ] Vérifier qu'une erreur apparaît (si implémenté côté client)

**Test des balises HTML :**
- [ ] Taper un message avec `<script>alert('test')</script>`
- [ ] Le message devrait être rejeté ou nettoyé

#### Test 3.2 : Validation du login
**Email invalide :**
- [ ] Aller sur `/login`
- [ ] Entrer "email_invalide" comme email
- [ ] Essayer de se connecter
- [ ] Vérifier qu'une erreur "Email invalide" apparaît

**Mot de passe vide :**
- [ ] Entrer un email valide
- [ ] Laisser le mot de passe vide
- [ ] Essayer de se connecter
- [ ] Vérifier qu'une erreur apparaît

#### Test 3.3 : Validation de l'inscription
**Nom d'utilisateur trop court :**
- [ ] Aller sur `/register`
- [ ] Entrer "ab" comme nom d'utilisateur (< 3 caractères)
- [ ] Vérifier qu'une erreur apparaît

**Mot de passe trop court :**
- [ ] Entrer un mot de passe de 5 caractères
- [ ] Vérifier qu'une erreur "au moins 6 caractères" apparaît

---

### 4. Intégration générale

#### Test 4.1 : Navigation
- [ ] Toutes les pages se chargent correctement
- [ ] La navbar s'affiche sur toutes les pages
- [ ] Le footer s'affiche sur toutes les pages
- [ ] Les notifications sont accessibles de partout

#### Test 4.2 : Responsive
**Mobile (< 600px) :**
- [ ] Ouvrir DevTools (F12)
- [ ] Passer en mode mobile
- [ ] La navbar s'adapte
- [ ] Les filtres de recherche passent en colonne
- [ ] Les messages s'affichent correctement

**Tablette (600-900px) :**
- [ ] Tester la vue tablette
- [ ] Vérifier l'affichage des annonces
- [ ] Vérifier l'affichage des messages

**Desktop (> 900px) :**
- [ ] Vérifier l'affichage normal
- [ ] Les filtres sont en ligne
- [ ] Les messages ont 2 colonnes

#### Test 4.3 : Performance
- [ ] Ouvrir l'onglet Network dans DevTools
- [ ] Rafraîchir la page d'accueil
- [ ] Vérifier que le temps de chargement est acceptable (< 3s)
- [ ] Vérifier qu'il n'y a pas d'erreurs 404 ou 500

---

## 🐛 Tests de bugs connus

### Bug potentiel 1 : Socket.IO déconnexion
**Scénario :**
1. Se connecter
2. Laisser l'onglet ouvert 30 minutes
3. Envoyer un message

**Résultat attendu :**
- Le message s'envoie correctement
- La connexion Socket.IO se reconnecte automatiquement

**Si échec :**
- Vérifier les logs de la console
- Vérifier que le backend est toujours actif

### Bug potentiel 2 : Filtres qui ne se réinitialisent pas
**Scénario :**
1. Appliquer plusieurs filtres
2. Naviguer vers une autre page
3. Revenir sur la page Annonces

**Résultat attendu :**
- Les filtres sont réinitialisés
- Aucun chip n'est affiché

**Si échec :**
- Vérifier le localStorage
- Vérifier l'état du composant

### Bug potentiel 3 : Notifications en double
**Scénario :**
1. Recevoir un message
2. Vérifier les notifications

**Résultat attendu :**
- Une seule notification apparaît

**Si échec :**
- Vérifier les logs Socket.IO
- Vérifier la logique de déduplication

---

## 🔧 Tests techniques

### Test 1 : Console du navigateur
- [ ] Ouvrir DevTools (F12)
- [ ] Onglet Console
- [ ] Vérifier qu'il n'y a pas d'erreurs rouges
- [ ] Les warnings jaunes sont acceptables

### Test 2 : Requêtes API
- [ ] Onglet Network dans DevTools
- [ ] Filtrer par "XHR"
- [ ] Vérifier que toutes les requêtes retournent 200 ou 201
- [ ] Vérifier qu'il n'y a pas de 401 (non autorisé) ou 500 (erreur serveur)

### Test 3 : Socket.IO
- [ ] Onglet Console
- [ ] Chercher "Socket.IO connecté"
- [ ] Vérifier que la connexion est établie
- [ ] Envoyer un message et vérifier l'événement "new_message"

### Test 4 : LocalStorage
- [ ] Onglet Application > Local Storage
- [ ] Vérifier la présence de "token" (si connecté)
- [ ] Vérifier la présence de "favorites"
- [ ] Vérifier que les données sont valides (JSON)

---

## 📊 Résultats attendus

### Critères de succès
- ✅ Tous les tests de la checklist passent
- ✅ Aucune erreur dans la console
- ✅ Toutes les requêtes API réussissent
- ✅ Socket.IO se connecte correctement
- ✅ L'application est responsive
- ✅ Les performances sont acceptables

### Critères d'échec
- ❌ Erreurs JavaScript dans la console
- ❌ Requêtes API qui échouent
- ❌ Socket.IO ne se connecte pas
- ❌ Affichage cassé sur mobile
- ❌ Temps de chargement > 5 secondes

---

## 🚀 Commandes de test

### Démarrer l'environnement de test
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start

# Terminal 3 - MongoDB (si local)
mongod
```

### Vérifier les logs
```bash
# Backend
cd server
npm run dev
# Regarder les logs dans le terminal

# Frontend
# Ouvrir DevTools (F12) > Console
```

### Tester avec plusieurs utilisateurs
```bash
# Navigateur 1 : Mode normal
http://localhost:3000

# Navigateur 2 : Mode incognito
http://localhost:3000

# Ou utiliser différents navigateurs
# Chrome + Firefox
```

---

## 📝 Rapport de test

### Template de rapport

```markdown
## Test effectué le : [DATE]

### Environnement
- OS : Windows/Mac/Linux
- Navigateur : Chrome/Firefox/Safari [VERSION]
- Node.js : [VERSION]
- MongoDB : [VERSION]

### Tests réussis
- [x] Test 1.1
- [x] Test 1.2
- ...

### Tests échoués
- [ ] Test X.X - Raison : ...

### Bugs trouvés
1. **Bug 1** : Description
   - Étapes : ...
   - Résultat attendu : ...
   - Résultat obtenu : ...

### Notes
- ...

### Recommandations
- ...
```

---

## 🎯 Prochaines étapes après les tests

### Si tous les tests passent
1. ✅ Commit des changements
2. ✅ Push vers le repository
3. ✅ Déploiement en staging
4. ✅ Tests en staging
5. ✅ Déploiement en production

### Si des tests échouent
1. 🐛 Noter tous les bugs
2. 🔧 Prioriser les corrections
3. 💻 Corriger les bugs
4. 🔄 Retester
5. ✅ Valider les corrections

---

**Bon testing ! 🧪**
