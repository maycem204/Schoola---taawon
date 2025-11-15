# Intégration du composant AdvancedSearch

## 📋 Contexte

La page `Listings.tsx` possède déjà un système de filtres fonctionnel. Le composant `AdvancedSearch` offre une interface alternative plus moderne avec des fonctionnalités supplémentaires.

## 🎯 Options d'intégration

Vous avez **3 options** pour intégrer AdvancedSearch :

---

## Option 1 : Remplacer complètement les filtres existants ⭐ RECOMMANDÉ

### Avantages
- Interface plus moderne et cohérente
- Slider de prix
- Filtres pliables (gain d'espace)
- Chips de filtres actifs
- Plus de villes disponibles

### Code à modifier

**Fichier : `client/src/pages/Listings.tsx`**

```typescript
// 1. Ajouter l'import en haut du fichier
import AdvancedSearch, { SearchFilters } from '../components/AdvancedSearch';

// 2. Remplacer la section des filtres (lignes 111-201) par :

{/* Recherche avancée */}
<AdvancedSearch 
  onSearch={(searchFilters: SearchFilters) => {
    setFilters({
      category: searchFilters.category,
      educationLevel: '', // AdvancedSearch n'a pas educationLevel
      city: searchFilters.city,
      search: searchFilters.query
    });
    setSortBy(searchFilters.sortBy);
    setPage(1);
  }}
  initialFilters={{
    query: filters.search,
    category: filters.category,
    city: filters.city,
    sortBy: sortBy
  }}
/>
```

### Modifications supplémentaires nécessaires

**Adapter le filtrage pour supporter le prix :**

```typescript
// Ajouter minPrice et maxPrice dans l'état
const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

// Modifier le filtrage
let filteredListings = Array.isArray(listings) ? listings.filter(listing => {
  const matchesCategory = !filters.category || listing.category === filters.category;
  const matchesEducationLevel = !filters.educationLevel || listing.educationLevel === filters.educationLevel;
  const matchesCity = !filters.city || listing.city.toLowerCase().includes(filters.city.toLowerCase());
  const matchesSearch = !filters.search || 
    listing.title.toLowerCase().includes(filters.search.toLowerCase()) ||
    listing.description.toLowerCase().includes(filters.search.toLowerCase());
  const matchesPrice = listing.price >= priceRange.min && listing.price <= priceRange.max;

  return matchesCategory && matchesEducationLevel && matchesCity && matchesSearch && matchesPrice;
}) : [];

// Mettre à jour le handler
<AdvancedSearch 
  onSearch={(searchFilters: SearchFilters) => {
    setFilters({
      category: searchFilters.category,
      educationLevel: '',
      city: searchFilters.city,
      search: searchFilters.query
    });
    setPriceRange({
      min: searchFilters.minPrice,
      max: searchFilters.maxPrice
    });
    setSortBy(searchFilters.sortBy);
    setPage(1);
  }}
/>
```

---

## Option 2 : Garder les deux systèmes (mode avancé/simple)

### Avantages
- Flexibilité pour l'utilisateur
- Transition en douceur
- Possibilité de comparer

### Code à ajouter

```typescript
const [advancedMode, setAdvancedMode] = useState(false);

// Dans le JSX, avant les filtres actuels :
<Box sx={{ mb: 2 }}>
  <Button 
    variant="outlined" 
    onClick={() => setAdvancedMode(!advancedMode)}
  >
    {advancedMode ? 'Mode simple' : 'Mode avancé'}
  </Button>
</Box>

{advancedMode ? (
  <AdvancedSearch 
    onSearch={(searchFilters: SearchFilters) => {
      // ... handler
    }}
  />
) : (
  <>
    {/* Filtres existants (lignes 111-201) */}
  </>
)}
```

---

## Option 3 : Garder les filtres existants (ne rien changer)

### Avantages
- Aucun risque
- Système déjà fonctionnel
- Pas de modifications nécessaires

### Utilisation d'AdvancedSearch ailleurs
Vous pouvez utiliser AdvancedSearch sur d'autres pages :
- Page d'accueil
- Page de recherche dédiée
- Sidebar de recherche

---

## 🔧 Mapping des catégories

### Catégories actuelles vs AdvancedSearch

**Listings.tsx actuel :**
```typescript
textbooks → Manuels
notebooks → Cahiers
stationery → Fournitures
electronics → Électronique
other → Autres
```

**AdvancedSearch :**
```typescript
Livres
Cahiers
Stylos
Calculatrices
Sacs
Matériel de dessin
Autre
```

### Solution : Adapter le mapping

```typescript
const mapAdvancedCategory = (advancedCat: string): string => {
  const mapping: { [key: string]: string } = {
    'Livres': 'textbooks',
    'Cahiers': 'notebooks',
    'Stylos': 'stationery',
    'Calculatrices': 'electronics',
    'Sacs': 'other',
    'Matériel de dessin': 'stationery',
    'Autre': 'other'
  };
  return mapping[advancedCat] || '';
};

// Utiliser dans le handler
<AdvancedSearch 
  onSearch={(searchFilters: SearchFilters) => {
    setFilters({
      category: mapAdvancedCategory(searchFilters.category),
      // ...
    });
  }}
/>
```

---

## 🎨 Personnalisation d'AdvancedSearch

### Modifier les catégories

**Fichier : `client/src/components/AdvancedSearch.tsx`**

```typescript
// Ligne 37-45, remplacer par vos catégories
const categories = [
  'Manuels',
  'Cahiers',
  'Fournitures',
  'Électronique',
  'Autres'
];
```

### Ajouter le niveau scolaire

```typescript
// Ajouter dans l'interface SearchFilters
export interface SearchFilters {
  query: string;
  category: string;
  condition: string;
  minPrice: number;
  maxPrice: number;
  city: string;
  sortBy: string;
  educationLevel: string; // NOUVEAU
}

// Ajouter dans l'état initial
const [filters, setFilters] = useState<SearchFilters>({
  // ...
  educationLevel: initialFilters.educationLevel || ''
});

// Ajouter un FormControl dans le JSX
<FormControl fullWidth size="small">
  <InputLabel>Niveau scolaire</InputLabel>
  <Select
    value={filters.educationLevel}
    label="Niveau scolaire"
    onChange={(e) => handleFilterChange('educationLevel', e.target.value)}
  >
    <MenuItem value="">Tous</MenuItem>
    <MenuItem value="primary">Primaire</MenuItem>
    <MenuItem value="middle">Collège</MenuItem>
    <MenuItem value="high">Lycée</MenuItem>
  </Select>
</FormControl>
```

---

## 📊 Comparaison des fonctionnalités

| Fonctionnalité | Filtres actuels | AdvancedSearch |
|----------------|-----------------|----------------|
| Recherche textuelle | ✅ | ✅ |
| Catégorie | ✅ (5) | ✅ (7) |
| Niveau scolaire | ✅ | ❌ (à ajouter) |
| Ville | ✅ (5) | ✅ (24) |
| Prix | ❌ | ✅ (slider) |
| État/Condition | ❌ | ✅ (4 options) |
| Tri | ✅ (2 options) | ✅ (4 options) |
| Filtres pliables | ❌ | ✅ |
| Chips actifs | ❌ | ✅ |
| Bouton effacer | ✅ | ✅ |

---

## 🚀 Recommandation finale

### Pour une meilleure UX : **Option 1 modifiée**

1. **Remplacer les filtres par AdvancedSearch**
2. **Ajouter le niveau scolaire dans AdvancedSearch**
3. **Adapter les catégories pour correspondre**
4. **Ajouter le filtrage par prix**

### Code complet recommandé

Créez un nouveau fichier : `client/src/pages/Listings.improved.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, CircularProgress, Pagination } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import AdvancedSearch, { SearchFilters } from '../components/AdvancedSearch';
import { useListings } from '../context/ListingsContext';

const Listings: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { listings, fetchListings, loading } = useListings();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    condition: '',
    minPrice: 0,
    maxPrice: 1000,
    city: '',
    sortBy: 'recent'
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setPage(1);
  };

  // Mapping des catégories
  const mapCategory = (advancedCat: string): string => {
    const mapping: { [key: string]: string } = {
      'Livres': 'textbooks',
      'Cahiers': 'notebooks',
      'Stylos': 'stationery',
      'Calculatrices': 'electronics',
      'Sacs': 'other',
      'Matériel de dessin': 'stationery',
      'Autre': 'other'
    };
    return mapping[advancedCat] || advancedCat;
  };

  // Filtrer les annonces
  let filteredListings = Array.isArray(listings) ? listings.filter(listing => {
    const matchesQuery = !searchFilters.query || 
      listing.title.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchFilters.query.toLowerCase());
    
    const mappedCategory = mapCategory(searchFilters.category);
    const matchesCategory = !searchFilters.category || listing.category === mappedCategory;
    
    const matchesCity = !searchFilters.city || 
      listing.city.toLowerCase() === searchFilters.city.toLowerCase();
    
    const matchesPrice = listing.price >= searchFilters.minPrice && 
                        listing.price <= searchFilters.maxPrice;

    return matchesQuery && matchesCategory && matchesCity && matchesPrice;
  }) : [];

  // Tri
  filteredListings = [...filteredListings].sort((a, b) => {
    switch (searchFilters.sortBy) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const paginatedListings = filteredListings.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Toutes les annonces
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/create-listing')}
          >
            Publier une annonce
          </Button>
        </Box>

        {/* Recherche avancée */}
        <AdvancedSearch onSearch={handleSearch} />

        {/* Résultats */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {filteredListings.length} annonce(s) trouvée(s)
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredListings.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography>Aucune annonce ne correspond à vos critères.</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 3 
            }}>
              {paginatedListings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </Box>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default Listings;
```

### Pour tester

1. Renommez `Listings.tsx` en `Listings.old.tsx`
2. Renommez `Listings.improved.tsx` en `Listings.tsx`
3. Testez l'application
4. Si tout fonctionne, supprimez `Listings.old.tsx`

---

## 🧪 Tests à effectuer après intégration

- [ ] La recherche textuelle fonctionne
- [ ] Les filtres par catégorie fonctionnent
- [ ] Le filtre par ville fonctionne
- [ ] Le slider de prix fonctionne
- [ ] Le tri fonctionne (4 options)
- [ ] Les chips de filtres actifs s'affichent
- [ ] Le bouton "Effacer tout" fonctionne
- [ ] La pagination fonctionne
- [ ] L'affichage est responsive
- [ ] Aucune erreur dans la console

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les imports
2. Vérifiez la console pour les erreurs
3. Vérifiez que les types correspondent
4. Testez avec des données simples

---

**Bonne intégration ! 🚀**
