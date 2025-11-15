# 🎓 Cycle et Domaine Universitaire

## ✅ Fonctionnalité ajoutée !

### Nouveaux champs pour les étudiants universitaires
- ✅ **Cycle universitaire** (Prépa, Licence, Ingénieur, Master, Doctorat)
- ✅ **Domaine d'études** (70+ domaines disponibles)

---

## 🎯 Utilisation

### Créer une annonce universitaire

1. **Sélectionner "🎓 Université"**
2. **3 champs apparaissent** :
   - Nom de l'université
   - **Cycle universitaire** ← NOUVEAU
   - **Domaine d'études** ← NOUVEAU

---

## 📚 Cycles disponibles

- 📚 **Prépa / Classes préparatoires**
- 🎓 **Licence** (L1, L2, L3)
- ⚙️ **Cycle Ingénieur**
- 🎯 **Master** (M1, M2)
- 🔬 **Doctorat / PhD**

---

## 🎨 Domaines d'études (70+)

### Sciences et Technologies
- Informatique / IT
- Génie Civil, Mécanique, Électrique, Industriel, Chimique
- Télécommunications, Électronique, Automatique
- Mathématiques, Physique, Chimie, Biologie
- Architecture

### Sciences Humaines et Sociales
- Droit, Sciences Politiques
- Sociologie, Psychologie, Philosophie
- Histoire, Géographie, Archéologie

### Économie et Gestion
- Économie, Gestion, Finance
- Comptabilité, Marketing, Management
- Commerce International, Entrepreneuriat

### Santé
- Médecine, Pharmacie
- Médecine Dentaire
- Sciences Infirmières, Kinésithérapie

### Lettres et Langues
- Lettres Arabes, Françaises, Anglaises
- Traduction, Linguistique

### Arts et Communication
- Arts Plastiques, Design
- Communication, Journalisme
- Cinéma, Musique, Théâtre

### Agriculture et Environnement
- Agronomie, Sciences Vétérinaires
- Environnement, Foresterie

### Tourisme et Hôtellerie
- Tourisme, Hôtellerie, Restauration

### Sport
- Sciences du Sport, Éducation Physique

---

## 📊 Exemples concrets

### Exemple 1 : Cours d'informatique
```
Titre: Cours Algorithmique et Structures de Données
Niveau: 🎓 Université
Université: INSAT
Cycle: 🎓 Licence (L1, L2, L3)
Domaine: Informatique / IT
Type: 🎁 Don
```

### Exemple 2 : Livre de médecine
```
Titre: Livre "Anatomie Humaine"
Niveau: 🎓 Université
Université: Faculté de Médecine de Tunis
Cycle: 🎯 Master (M1, M2)
Domaine: Médecine
Type: 💰 Vente - 80 DT
```

### Exemple 3 : Polycopiés d'ingénieur
```
Titre: Polycopiés Génie Mécanique
Niveau: 🎓 Université
Université: ENIT
Cycle: ⚙️ Cycle Ingénieur
Domaine: Génie Mécanique
Type: 🔄 Échange (≈30 DT)
```

---

## 🎨 Interface

### Formulaire complet
```
┌─────────────────────────────────┐
│ Niveau scolaire:                │
│ [🎓 Université            ▼]   │
│                                 │
│ ⬇️ 3 champs apparaissent        │
│                                 │
│ Nom de l'université:            │
│ [INSAT___________________]      │
│                                 │
│ Cycle universitaire:            │
│ [🎓 Licence (L1, L2, L3) ▼]   │
│   ├─ 📚 Prépa                   │
│   ├─ 🎓 Licence                 │
│   ├─ ⚙️ Cycle Ingénieur         │
│   ├─ 🎯 Master                  │
│   └─ 🔬 Doctorat                │
│                                 │
│ Domaine d'études:               │
│ [Informatique / IT       ▼]    │
│   ├─ Informatique / IT          │
│   ├─ Génie Civil                │
│   ├─ Médecine                   │
│   ├─ Droit                      │
│   └─ ... (70+ domaines)         │
└─────────────────────────────────┘
```

---

## 📁 Fichiers modifiés/créés

### Backend (2 fichiers)
1. ✅ `server/models/Listing.js`
   - Ajout de universityCycle (enum)
   - Ajout de universityDomain (String)

2. ✅ `server/middleware/validation.js`
   - Validation universityCycle
   - Validation universityDomain

### Frontend (4 fichiers)
3. ✅ `client/src/constants/university.ts` (créé)
   - UNIVERSITY_CYCLES (5 cycles)
   - UNIVERSITY_DOMAINS (70+ domaines)

4. ✅ `client/src/types/listing.ts`
   - Ajout universityCycle?
   - Ajout universityDomain?

5. ✅ `client/src/pages/CreateListing.tsx`
   - 2 nouveaux champs conditionnels
   - Logique de soumission

6. ⏳ `client/src/pages/EditListing.tsx` (à faire)

---

## 🧪 Tests à effectuer

### Test 1 : Créer annonce universitaire complète
1. ✅ Sélectionner "🎓 Université"
2. ✅ Entrer "INSAT"
3. ✅ Sélectionner "🎓 Licence"
4. ✅ Sélectionner "Informatique / IT"
5. ✅ Publier
6. ✅ Vérifier l'affichage

### Test 2 : Changer de niveau
1. ✅ Sélectionner "🎓 Université"
2. ✅ Les 3 champs apparaissent
3. ✅ Changer pour "🎯 Lycée"
4. ✅ Les 3 champs disparaissent

### Test 3 : Domaines triés
1. ✅ Ouvrir "Domaine d'études"
2. ✅ Vérifier que les domaines sont triés alphabétiquement

---

## 💡 Avantages

### Pour les étudiants
- ✅ Ciblage ultra-précis
- ✅ Trouver des documents de leur cycle
- ✅ Échanger avec des étudiants du même domaine
- ✅ Partager des cours spécifiques

### Exemples de recherche
- "Cours Licence Informatique INSAT"
- "Livre Master Médecine"
- "Polycopiés Ingénieur Génie Civil ENIT"

---

## 🔄 Prochaines étapes

### À faire
- [ ] Mettre à jour EditListing.tsx
- [ ] Afficher cycle et domaine dans ListingDetail
- [ ] Afficher dans ListingCard
- [ ] Ajouter filtres par cycle et domaine

---

## 📊 Statistiques

- **Cycles disponibles** : 5
- **Domaines disponibles** : 70+
- **Fichiers modifiés** : 5
- **Fichiers créés** : 2

---

**La fonctionnalité est maintenant disponible ! 🎓✨**

**Testez en créant une annonce universitaire avec cycle et domaine !**
