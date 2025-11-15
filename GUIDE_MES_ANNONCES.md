# 📝 Guide - Mes Annonces

## Comment voir et gérer mes annonces

---

## 🎯 Accéder à "Mes Annonces"

### Méthode 1 : Via le menu
1. Cliquez sur votre **avatar** en haut à droite
2. Sélectionnez **"Mon profil"**
3. Vous verrez la section **"Mes annonces"**

### Méthode 2 : Via l'URL
- Allez directement sur : `http://localhost:3000/profile`

---

## 📊 Ce que vous voyez

### En-tête du profil
```
┌─────────────────────────────────────────┐
│ [Avatar] Votre nom                      │
│          📧 email@example.com           │
│          📍 Ville                       │
│          📱 Téléphone (si ajouté)       │
│          🏠 Adresse (si ajoutée)        │
│                                         │
│ Bio: Votre biographie...                │
│                                         │
│ [Modifier le profil]                    │
├─────────────────────────────────────────┤
│ Statistiques:                           │
│  📊 5 Annonces   ✅ 3 Disponibles       │
│                  ✔️ 2 Échangées         │
└─────────────────────────────────────────┘
```

### Section "Mes annonces"
```
Mes annonces
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ [Image]      │ │ [Image]      │ │ [Image]      │
│              │ │              │ │              │
│ Titre        │ │ Titre        │ │ Titre        │
│ 📚 Catégorie │ │ 📚 Catégorie │ │ 📚 Catégorie │
│ ✅ Disponible│ │ ✅ Disponible│ │ 🔄 En échange│
│              │ │              │ │              │
│ 💰 25 DT     │ │ 🔄 Échange   │ │ 🎁 Gratuit   │
│              │ │   (≈15 DT)   │ │              │
│              │ │              │ │              │
│ Description  │ │ Description  │ │ Description  │
│ ...          │ │ ...          │ │ ...          │
│              │ │              │ │              │
│ Publié le    │ │ Publié le    │ │ Publié le    │
│ 07/11/2024   │ │ 06/11/2024   │ │ 05/11/2024   │
│              │ │              │ │              │
│ [Voir]       │ │ [Voir]       │ │ [Voir]       │
│    ✏️ 🗑️     │ │    ✏️ 🗑️     │ │    ✏️ 🗑️     │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## 🔧 Actions disponibles

### 1. **Voir l'annonce** 👁️
- Cliquez sur le bouton **"Voir"**
- Vous serez redirigé vers la page détaillée de l'annonce
- Vous verrez toutes les informations et images

### 2. **Modifier l'annonce** ✏️
- Cliquez sur l'icône **crayon** (✏️)
- Vous serez redirigé vers le formulaire d'édition
- Vous pouvez modifier :
  - Le titre
  - La description
  - La catégorie
  - L'état
  - Le niveau scolaire
  - La ville
  - **Le type d'échange** (vente/échange/don)
  - **Le prix** (si vente)
  - **La valeur estimée** (si échange)
  - Le statut (disponible/en échange/échangé)

### 3. **Supprimer l'annonce** 🗑️
- Cliquez sur l'icône **poubelle** (🗑️)
- Une confirmation vous sera demandée
- Cliquez sur **"Supprimer"** pour confirmer
- ⚠️ **Attention** : Cette action est irréversible !

---

## 📋 Informations affichées sur chaque annonce

### Badges et informations
1. **Catégorie** : 📚 Manuels, 📓 Cahiers, etc.
2. **Statut** : ✅ Disponible, 🔄 En échange, ✔️ Échangé
3. **Type d'échange** :
   - 💰 **Prix** (si vente) : "25 DT"
   - 🔄 **Échange** (si échange) : "Échange (≈15 DT)"
   - 🎁 **Gratuit** (si don) : "Gratuit"
4. **Description** : Aperçu (2 lignes max)
5. **Date de publication** : "Publié le 07/11/2024"

---

## 🎨 Codes couleur

### Statuts
- **Vert** (✅) : Disponible
- **Orange** (🔄) : En cours d'échange
- **Rouge** (✔️) : Échange terminé

### Types d'échange
- **Bleu** (💰) : Vente avec prix
- **Violet** (🔄) : Échange avec valeur estimée
- **Vert** (🎁) : Don gratuit

---

## 📊 Statistiques

En haut de votre profil, vous verrez :
- **Nombre total d'annonces** publiées
- **Nombre d'annonces disponibles**
- **Nombre d'annonces échangées**

---

## 🔄 Modifier le type d'échange d'une annonce

### Exemple : Passer de "Vente" à "Don"

1. Cliquez sur ✏️ (modifier)
2. Dans le formulaire, changez **"Type d'échange"**
3. Sélectionnez **"🎁 Don"**
4. Le champ prix disparaît
5. Un message "Article gratuit" apparaît
6. Cliquez sur **"Enregistrer les modifications"**
7. Votre annonce affiche maintenant **"🎁 Gratuit"**

---

## 💡 Conseils

### Pour une meilleure gestion
1. **Mettez à jour le statut** :
   - "Disponible" : L'article est toujours disponible
   - "En échange" : Vous êtes en discussion avec quelqu'un
   - "Échangé" : L'échange est terminé

2. **Supprimez les annonces obsolètes** :
   - Si vous avez vendu/échangé l'article
   - Si vous ne voulez plus le proposer

3. **Modifiez le prix** :
   - Si personne n'est intéressé, baissez le prix
   - Ou passez en "Don" pour donner gratuitement

4. **Changez en "Don"** :
   - Si vous voulez vous débarrasser rapidement
   - Pour aider d'autres étudiants

---

## 🚫 Si vous n'avez pas d'annonces

Vous verrez ce message :
```
┌─────────────────────────────────────┐
│ Vous n'avez pas encore publié       │
│ d'annonce                           │
│                                     │
│ [Publier une annonce]               │
└─────────────────────────────────────┘
```

Cliquez sur **"Publier une annonce"** pour créer votre première annonce !

---

## 📱 Sur mobile

L'affichage s'adapte :
- **1 colonne** sur petit écran
- **2 colonnes** sur tablette
- **3 colonnes** sur ordinateur

---

## ⚙️ Raccourcis clavier

| Action | Raccourci |
|--------|-----------|
| Aller au profil | Cliquer sur avatar |
| Modifier annonce | Clic sur ✏️ |
| Supprimer annonce | Clic sur 🗑️ |
| Voir annonce | Clic sur "Voir" |

---

## 🔍 Rechercher dans mes annonces

Pour l'instant, toutes vos annonces sont affichées.

**Astuce** : Utilisez Ctrl+F (ou Cmd+F sur Mac) pour rechercher dans la page !

---

## 📈 Statistiques détaillées

### Ce que vous pouvez voir
- **Total** : Nombre total d'annonces
- **Disponibles** : Annonces encore actives
- **Échangées** : Annonces terminées

### Utilité
- Suivre votre activité
- Voir combien d'échanges vous avez réalisés
- Gérer votre inventaire

---

## 🎯 Cas d'usage

### Scénario 1 : Vendre un livre
1. Créer annonce → Type "Vente" → Prix 25 DT
2. Quelqu'un vous contacte
3. Modifier → Statut "En échange"
4. Après la vente → Statut "Échangé"
5. Ou supprimer l'annonce

### Scénario 2 : Échanger des cahiers
1. Créer annonce → Type "Échange" → Valeur 15 DT
2. Quelqu'un propose un échange
3. Discuter via messages
4. Après l'échange → Statut "Échangé"

### Scénario 3 : Donner des fournitures
1. Créer annonce → Type "Don" → Gratuit
2. Quelqu'un intéressé vous contacte
3. Après le don → Supprimer l'annonce

---

## ❓ Questions fréquentes

### Puis-je modifier le prix après publication ?
✅ **Oui** ! Cliquez sur ✏️ et changez le prix.

### Puis-je changer de "Vente" à "Don" ?
✅ **Oui** ! Changez le type d'échange dans le formulaire d'édition.

### Puis-je récupérer une annonce supprimée ?
❌ **Non** ! La suppression est définitive. Soyez sûr avant de supprimer.

### Combien d'annonces puis-je publier ?
✅ **Illimité** ! Vous pouvez publier autant d'annonces que vous voulez.

### Les autres voient-ils mes annonces supprimées ?
❌ **Non** ! Une fois supprimée, l'annonce disparaît pour tout le monde.

---

## 🎉 Résumé

**Votre page "Mes Annonces" vous permet de :**
- ✅ Voir toutes vos annonces
- ✅ Modifier vos annonces (titre, prix, type, etc.)
- ✅ Supprimer vos annonces
- ✅ Suivre vos statistiques
- ✅ Gérer votre inventaire facilement

**Accès rapide** : Profil → Mes annonces

---

**Bonne gestion de vos annonces ! 📝✨**
