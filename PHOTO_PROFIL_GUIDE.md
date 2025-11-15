# 📸 Guide - Photo de Profil

## Comment ajouter et modifier votre photo de profil

---

## ✅ Problème résolu !

Les erreurs TypeScript ont été corrigées. L'application devrait maintenant compiler sans erreurs.

---

## 🎯 Fonctionnalité ajoutée

### Photo de profil complète
- ✅ Upload de photo de profil
- ✅ Prévisualisation avant sauvegarde
- ✅ Affichage dans le profil
- ✅ Affichage dans l'avatar
- ✅ Stockage sur le serveur

---

## 📋 Comment utiliser

### 1. Accéder à l'édition du profil
1. Cliquez sur votre **avatar** en haut à droite
2. Sélectionnez **"Mon profil"**
3. Cliquez sur **"Modifier le profil"**

### 2. Ajouter une photo de profil
```
┌─────────────────────────────────┐
│ Modifier mon profil             │
├─────────────────────────────────┤
│                                 │
│        [Avatar actuel]          │
│      (ou initiale si pas        │
│       de photo)                 │
│                                 │
│   [📷 Changer la photo]         │
│                                 │
│ Adresse: [______________]       │
│ Téléphone: [____________]       │
│ Bio: [__________________]       │
│                                 │
│ [Annuler]  [Enregistrer]        │
└─────────────────────────────────┘
```

### 3. Sélectionner une photo
1. Cliquez sur **"📷 Changer la photo"**
2. Sélectionnez une image depuis votre ordinateur
3. **Prévisualisation instantanée** de la photo
4. Remplissez les autres champs si vous voulez
5. Cliquez sur **"Enregistrer"**

### 4. Voir votre photo
Votre photo apparaît :
- ✅ Dans votre profil (grand avatar)
- ✅ Dans la navbar (petit avatar)
- ✅ Dans vos annonces (à venir)
- ✅ Dans les messages (à venir)

---

## 🖼️ Formats acceptés

### Images autorisées
- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **GIF** (.gif)

### Taille maximale
- **5 MB** par image

### Recommandations
- **Format carré** recommandé (ex: 500x500px)
- **Bonne qualité** mais pas trop lourde
- **Visage visible** pour une meilleure reconnaissance

---

## 🔧 Fonctionnalités techniques

### Backend
- ✅ Route `/api/users/profile` (PUT)
- ✅ Upload avec Multer
- ✅ Stockage dans `/uploads`
- ✅ Validation du type de fichier
- ✅ Limite de taille (5MB)

### Frontend
- ✅ Service `userService.updateProfile()`
- ✅ Prévisualisation avec FileReader
- ✅ Upload avec FormData
- ✅ Indicateur de chargement
- ✅ Gestion des erreurs

---

## 📊 Champs du profil

### Obligatoires (inscription)
- ✅ Nom d'utilisateur
- ✅ Email
- ✅ Mot de passe
- ✅ Ville

### Facultatifs (profil)
- ⭐ **Photo de profil** ← NOUVEAU
- ⭐ **Adresse**
- ⭐ **Téléphone**
- ⭐ **Bio** (max 500 caractères)

---

## 🎨 Affichage

### Avec photo
```
┌─────────────────────────┐
│ [Photo de profil]       │
│                         │
│ Ahmed                   │
│ 📧 ahmed@email.com      │
│ 📍 Tunis                │
│ 📱 +216 20 123 456      │
│ 🏠 15 Av. Bourguiba     │
│                         │
│ Bio: Étudiant...        │
└─────────────────────────┘
```

### Sans photo (par défaut)
```
┌─────────────────────────┐
│ [A] (initiale)          │
│                         │
│ Ahmed                   │
│ 📧 ahmed@email.com      │
│ 📍 Tunis                │
└─────────────────────────┘
```

---

## 🔄 Processus de mise à jour

### 1. Sélection de la photo
```javascript
// L'utilisateur sélectionne une image
handleProfilePictureChange()
  ↓
// Prévisualisation créée
FileReader.readAsDataURL()
  ↓
// État mis à jour
setProfilePicturePreview()
```

### 2. Sauvegarde
```javascript
// Clic sur "Enregistrer"
handleSaveProfile()
  ↓
// Envoi au serveur
userService.updateProfile()
  ↓
// Upload avec FormData
POST /api/users/profile
  ↓
// Sauvegarde dans MongoDB
User.findByIdAndUpdate()
  ↓
// Rechargement de la page
window.location.reload()
```

---

## 🐛 Résolution des erreurs TypeScript

### Problème initial
```
Property 'address' does not exist on type 'User'
Property 'phone' does not exist on type 'User'
Property 'bio' does not exist on type 'User'
```

### Solution appliquée
✅ Mise à jour du type `User` dans `auth.service.ts`
```typescript
export interface User {
  id: string;
  username: string;
  email: string;
  city: string;
  address?: string;      // ← Ajouté
  phone?: string;        // ← Ajouté
  profilePicture?: string; // ← Ajouté
  bio?: string;          // ← Ajouté
}
```

---

## 📁 Fichiers modifiés/créés

### Backend (3 fichiers)
1. ✅ `server/controllers/user.controller.js` (créé)
2. ✅ `server/routes/user.routes.js` (créé)
3. ✅ `server/index.js` (modifié)

### Frontend (3 fichiers)
4. ✅ `client/src/services/auth.service.ts` (modifié)
5. ✅ `client/src/services/user.service.ts` (créé)
6. ✅ `client/src/pages/Profile.tsx` (modifié)

### Documentation (1 fichier)
7. ✅ `PHOTO_PROFIL_GUIDE.md` (ce fichier)

---

## 🧪 Test rapide (2 min)

### Test de la photo de profil
1. ✅ Aller sur "Mon profil"
2. ✅ Cliquer sur "Modifier le profil"
3. ✅ Cliquer sur "📷 Changer la photo"
4. ✅ Sélectionner une image
5. ✅ Vérifier la prévisualisation
6. ✅ Ajouter adresse, téléphone, bio
7. ✅ Cliquer sur "Enregistrer"
8. ✅ Vérifier que la photo s'affiche

---

## 💡 Conseils

### Pour une bonne photo de profil
1. **Utilisez une photo récente**
2. **Visage bien visible**
3. **Bonne luminosité**
4. **Fond neutre** (recommandé)
5. **Format carré** (idéal)

### Taille optimale
- **Minimum** : 200x200 pixels
- **Recommandé** : 500x500 pixels
- **Maximum** : 2000x2000 pixels

### Poids du fichier
- **Idéal** : 100-500 KB
- **Maximum** : 5 MB

---

## 🔐 Sécurité

### Validations appliquées
- ✅ Types de fichiers autorisés (JPEG, PNG, GIF)
- ✅ Taille maximale (5 MB)
- ✅ Authentification requise
- ✅ Upload sécurisé avec Multer
- ✅ Noms de fichiers uniques

---

## 🎯 Prochaines étapes (optionnel)

### Améliorations possibles
- [ ] Recadrage de l'image
- [ ] Compression automatique
- [ ] Filtres et effets
- [ ] Photos multiples (galerie)
- [ ] Photo de couverture

---

## ❓ FAQ

### Puis-je changer ma photo plusieurs fois ?
✅ **Oui** ! Vous pouvez changer votre photo autant de fois que vous voulez.

### Que se passe-t-il avec l'ancienne photo ?
La nouvelle photo remplace l'ancienne. L'ancien fichier reste sur le serveur mais n'est plus utilisé.

### Puis-je supprimer ma photo ?
Pour l'instant, vous pouvez seulement la remplacer. Pour la supprimer, contactez l'administrateur.

### La photo est-elle visible par tous ?
✅ **Oui** ! Votre photo de profil est publique et visible par tous les utilisateurs.

### Puis-je utiliser un avatar au lieu d'une photo ?
✅ **Oui** ! Si vous n'uploadez pas de photo, votre initiale sera affichée.

---

## 🎉 Résumé

**Vous pouvez maintenant :**
- ✅ Ajouter une photo de profil
- ✅ Voir la prévisualisation avant sauvegarde
- ✅ Modifier votre photo à tout moment
- ✅ Ajouter adresse, téléphone et bio
- ✅ Voir votre photo dans le profil

**L'application compile sans erreurs !** 🚀

---

**Profitez de votre nouveau profil personnalisé ! 📸✨**
