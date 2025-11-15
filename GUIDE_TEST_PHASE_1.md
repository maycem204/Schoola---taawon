# 🧪 Guide de Test - Phase 1

## ⚡ Démarrage Rapide

### Étape 1 : Démarrer MongoDB
```bash
# Ouvrir le terminal et démarrer MongoDB
mongod

# OU si vous utilisez MongoDB Compass, assurez-vous qu'il est lancé
```

### Étape 2 : Démarrer le Backend
```bash
cd c:\Users\hcman\Desktop\schoola-taawon\server
npm start
```

**Attendre ce message** :
```
✅ MongoDB connecté avec succès
Server is running on port 5001
```

### Étape 3 : Démarrer le Frontend (Nouveau terminal)
```bash
cd c:\Users\hcman\Desktop\schoola-taawon\client
npm start
```

**Navigateur s'ouvre automatiquement** sur `http://localhost:3000`

---

## 📋 Checklist de Test Complète

### ✅ Préparation : Créer 2 Comptes (Si pas déjà fait)

#### Navigateur Principal (Chrome)
1. Aller sur http://localhost:3000/register
2. Créer un compte "User1" :
   - Username: `test1`
   - Email: `test1@test.com`
   - Password: `test123`
   - Ville: Tunis

#### Navigateur Incognito (Chrome) OU Firefox
1. Ouvrir mode incognito / Firefox
2. Aller sur http://localhost:3000/register
3. Créer un compte "User2" :
   - Username: `test2`
   - Email: `test2@test.com`
   - Password: `test123`
   - Ville: Tunis

---

## 🧪 Test 1 : Badge Compteur Navbar

### Objectif
Vérifier que le badge 💬 dans la navbar affiche le bon nombre de messages non lus.

### Étapes

#### 1. État Initial (User1)
```
[ ] Regarder la navbar en haut
[ ] Chercher l'icône 💬 Messages
[ ] Vérifier le badge rouge :
    - S'il y a 0 message non lu : pas de badge
    - S'il y a des messages : badge avec nombre (ex: (3))
```

**Ce que vous devez voir** :
```
┌─────────────────────────────────┐
│ 📚 Schoola-Taawon  Annonces  💬(0)│  ← Pas de badge si 0
└─────────────────────────────────┘
```

#### 2. Créer une Annonce (User1)
```
[ ] Cliquer sur "Publier"
[ ] Créer une annonce test :
    - Titre: "Manuel de Maths"
    - Description: "Manuel en bon état"
    - Catégorie: Manuels scolaires
    - Prix: 25
    - Publier
```

#### 3. Envoyer un Message (User2 → User1)
```
[ ] Sur le navigateur User2 :
    [ ] Aller sur "Annonces"
    [ ] Cliquer sur "Manuel de Maths"
    [ ] Cliquer sur "Contacter le vendeur"
    [ ] Écrire : "Bonjour, est-ce disponible ?"
    [ ] Envoyer
```

#### 4. Vérifier le Badge (User1)
```
[ ] Sur le navigateur User1 :
    [ ] Regarder la navbar
    [ ] Le badge 💬 devrait afficher (1)
    [ ] Attendre 5-10 secondes
    [ ] Le badge devrait se mettre à jour automatiquement
```

**Ce que vous devez voir** :
```
┌─────────────────────────────────┐
│ 📚 Schoola-Taawon  Annonces  💬(1)│  ← Badge rouge avec 1
└─────────────────────────────────┘
```

✅ **TEST RÉUSSI** si le badge affiche (1)

---

## 🧪 Test 2 : Prévisualisation du Dernier Message

### Objectif
Vérifier que la liste des conversations affiche un aperçu du dernier message.

### Étapes

#### 1. Ouvrir la Messagerie (User1)
```
[ ] Cliquer sur l'icône 💬 dans la navbar
[ ] Vous arrivez sur /messages
```

#### 2. Vérifier la Prévisualisation
```
[ ] Dans la liste de gauche, trouver la conversation avec test2
[ ] Vérifier que vous voyez :
    [ ] Le nom de l'utilisateur (test2)
    [ ] L'heure (ex: "5m", "14:30", "Hier")
    [ ] Le titre de l'annonce (📚 Manuel de Maths)
    [ ] Le dernier message (ex: "Bonjour, est-ce disponible ?")
```

**Ce que vous devez voir** :
```
┌────────────────────────┐
│ 🔵 test2          5m   │  ← Heure intelligente
│ 📚 Manuel de Maths     │  ← Titre annonce
│ Bonjour, est-ce dis... │  ← Prévisualisation (tronquée)
└────────────────────────┘
```

#### 3. Envoyer une Réponse
```
[ ] Cliquer sur la conversation
[ ] Écrire : "Oui, disponible demain"
[ ] Envoyer
[ ] Regarder la liste de gauche
```

**Ce que vous devez voir** :
```
┌────────────────────────┐
│ test2            À l'instant│  ← Heure mise à jour
│ 📚 Manuel de Maths     │
│ Vous: Oui, disponib... │  ← Votre message avec "Vous:"
└────────────────────────┘
```

✅ **TEST RÉUSSI** si :
- Préfixe "Vous: " affiché pour vos messages
- Heure mise à jour correctement
- Message tronqué avec "..." si trop long

---

## 🧪 Test 3 : Séparateurs de Date

### Objectif
Vérifier que les conversations affichent des séparateurs pour organiser les messages par date.

### Étapes

#### 1. Ouvrir la Conversation
```
[ ] Dans /messages, cliquer sur la conversation avec test2
[ ] La zone de droite affiche les messages
```

#### 2. Vérifier les Séparateurs
```
[ ] Chercher les séparateurs de date
[ ] Selon l'heure actuelle, vous devriez voir :
    [ ] "Aujourd'hui" pour les messages d'aujourd'hui
    [ ] Peut-être "Hier" si vous avez des vieux messages
```

**Ce que vous devez voir** :
```
┌──────────────────────────────────┐
│                                  │
│ ──────── Aujourd'hui ────────    │
│                                  │
│ Bonjour, est-ce disponible ?     │
│ 14:25                            │
│                                  │
│         Oui, disponible demain   │
│         14:30                    │
│                                  │
└──────────────────────────────────┘
```

#### 3. Tester avec Messages Espacés (Optionnel)
```
[ ] Attendre quelques minutes
[ ] Envoyer un nouveau message
[ ] Vérifier qu'il reste sous "Aujourd'hui"
```

✅ **TEST RÉUSSI** si :
- Séparateur "Aujourd'hui" visible
- Messages groupés sous le bon séparateur
- Style avec chip gris clair

---

## 🧪 Test 4 : Heure Intelligente

### Objectif
Vérifier que l'heure s'affiche de manière contextuelle dans la liste.

### Étapes

#### 1. Messages Récents
```
[ ] Envoyer un message maintenant
[ ] Regarder la liste de gauche
[ ] L'heure devrait afficher : "À l'instant" ou "1m"
```

#### 2. Attendre 5 Minutes
```
[ ] Attendre 5 minutes (ou changer l'heure système)
[ ] Rafraîchir la page
[ ] L'heure devrait afficher : "5m"
```

#### 3. Tester Différents Formats
```
Si possible, tester avec des messages de différentes heures :
[ ] Moins d'1 heure : "45m"
[ ] Moins de 24h : "3h"
[ ] Hier : "Hier"
[ ] Cette semaine : "Lun." (jour de la semaine)
[ ] Plus ancien : "15 Nov" (date courte)
```

**Exemples attendus** :
```
┌────────────────────┐
│ User1    À l'instant│  ← < 1 minute
│ User2          15m │  ← 15 minutes
│ User3           3h │  ← 3 heures
│ User4         Hier │  ← Hier
│ User5          Lun.│  ← Cette semaine
│ User6      15 Nov. │  ← Plus ancien
└────────────────────┘
```

✅ **TEST RÉUSSI** si :
- Format adapté au contexte temporel
- Pas de dates techniques (2024-11-08 14:30)
- Format naturel et lisible

---

## 🧪 Test 5 : Badge se Met à Jour en Temps Réel

### Objectif
Vérifier que le badge dans la navbar se met à jour automatiquement.

### Étapes

#### 1. Avoir un Message Non Lu (User1)
```
[ ] User2 envoie un message
[ ] User1 voit le badge (1)
```

#### 2. Lire le Message
```
[ ] User1 clique sur 💬
[ ] Ouvre la conversation
[ ] Lit le message
[ ] Badge devrait passer de (1) à (0)
```

#### 3. Recevoir un Nouveau Message
```
[ ] Rester sur la page /messages
[ ] User2 envoie un message
[ ] Badge devrait passer de (0) à (1) automatiquement
```

#### 4. Test avec Plusieurs Messages
```
[ ] User2 envoie 3 messages d'affilée
[ ] Badge devrait rester à (1) car c'est la même conversation
```

✅ **TEST RÉUSSI** si :
- Badge se met à jour sans rafraîchir
- Badge précis (compte les conversations, pas les messages)
- Badge disparaît quand tout est lu

---

## 🧪 Test 6 : Test Complet End-to-End

### Scénario : Conversation Complète

#### Côté User2 (Acheteur)
```
1. [ ] Aller sur "Annonces"
2. [ ] Trouver "Manuel de Maths"
3. [ ] Cliquer sur "Voir l'annonce"
4. [ ] Cliquer sur "Contacter le vendeur"
5. [ ] Écrire : "Bonjour, quel est le prix ?"
6. [ ] Envoyer
7. [ ] Vérifier la prévisualisation : "Vous: Bonjour, quel est..."
```

#### Côté User1 (Vendeur)
```
1. [ ] Regarder navbar : badge devrait afficher (1)
2. [ ] Cliquer sur 💬
3. [ ] Voir conversation avec test2 en bleu (non lu)
4. [ ] Voir prévisualisation : "Bonjour, quel est le prix ?"
5. [ ] Voir heure : "À l'instant"
6. [ ] Cliquer sur conversation
7. [ ] Voir séparateur : "Aujourd'hui"
8. [ ] Voir message : "Bonjour, quel est le prix ?"
9. [ ] Répondre : "25 DT, négociable"
10. [ ] Badge devrait passer à (0)
```

#### Retour User2
```
1. [ ] Regarder navbar : badge devrait afficher (1)
2. [ ] Conversation en bleu (non lu)
3. [ ] Prévisualisation : "User1: 25 DT, négociable"
4. [ ] Ouvrir conversation
5. [ ] Voir séparateur "Aujourd'hui"
6. [ ] Voir les 2 messages espacés
```

✅ **TEST RÉUSSI** si tout le flux fonctionne sans erreur

---

## 📊 Résultats Attendus

### ✅ Tous les Tests Passent
Vous devriez voir :
- ✅ Badge compteur fonctionnel
- ✅ Prévisualisation des messages
- ✅ Séparateurs de date
- ✅ Heure intelligente
- ✅ Mise à jour en temps réel

### ⚠️ Problèmes Possibles

#### Problème 1 : Badge ne s'affiche pas
**Solution** :
```bash
# Vérifier que le backend est démarré
# Vérifier la console (F12) pour les erreurs
# Vérifier que l'utilisateur est connecté
```

#### Problème 2 : Prévisualisation vide
**Solution** :
```bash
# Vérifier que la conversation a au moins 1 message
# Vérifier les logs du backend
# Rafraîchir la page
```

#### Problème 3 : Séparateurs absents
**Solution** :
```bash
# Rafraîchir la page
# Vérifier que vous avez des messages
# Vérifier la console pour les erreurs
```

#### Problème 4 : Heure incorrecte
**Solution** :
```bash
# Vérifier l'heure système
# Rafraîchir la page
# Attendre quelques secondes
```

---

## 🔍 Logs à Vérifier

### Console Navigateur (F12)
Vous devriez voir :
```
Socket.IO connecté pour utilisateur: 673abc...
Récupération conversations pour utilisateur: 673abc...
X conversation(s) trouvée(s)
```

**PAS d'erreurs rouges** ❌

### Console Serveur
Vous devriez voir :
```
✅ MongoDB connecté avec succès
Server is running on port 5001
A user connected
GET /api/messages/conversations 200
GET /api/messages/unread-count 200
```

**PAS d'erreurs** ❌

---

## 📸 Captures d'Écran Recommandées

Pour documenter vos tests, prenez des captures d'écran de :

1. **Badge compteur** : Navbar avec badge (1), (2), etc.
2. **Prévisualisation** : Liste de conversations avec aperçus
3. **Séparateurs** : Conversation avec "Aujourd'hui", "Hier"
4. **Heure intelligente** : Liste avec différents formats d'heure

---

## ✅ Validation Finale

### Checklist Complète

- [ ] Badge compteur fonctionne
- [ ] Badge se met à jour automatiquement
- [ ] Badge disparaît quand messages lus
- [ ] Prévisualisation affiche le dernier message
- [ ] Préfixe "Vous: " pour mes messages
- [ ] Séparateurs de date visibles
- [ ] "Aujourd'hui" pour messages du jour
- [ ] Heure intelligente dans la liste
- [ ] Format adaptatif (15m, 3h, Hier)
- [ ] Pas d'erreurs console
- [ ] Pas d'erreurs serveur
- [ ] Flux complet fonctionne

### Si Tous les Tests Passent ✅

**🎉 FÉLICITATIONS !**

La Phase 1 est fonctionnelle ! Vous avez maintenant :
- ✅ Séparateurs de date intelligents
- ✅ Heure contextuelle
- ✅ Prévisualisation des messages
- ✅ Badge compteur temps réel

**Prêt pour la Phase 2 ?**

Quand vous serez prêt, revenez me voir et nous implémenterons :
1. Double coche de lecture ✓✓
2. Indicateur "en train d'écrire" ⚫⚫⚫
3. Son de notification 🔔

---

## 📞 Besoin d'Aide ?

Si vous rencontrez des problèmes :

1. **Vérifier les logs** (console navigateur + serveur)
2. **Redémarrer les serveurs** (backend + frontend)
3. **Vérifier MongoDB** (doit être lancé)
4. **Me contacter** avec les erreurs exactes

---

**Bon courage pour les tests ! 🚀**

Une fois terminé, dites-moi si tout fonctionne ou s'il y a des problèmes à corriger.
