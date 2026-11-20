# OXBride Atelier — Design System

## Palette de couleurs

| Nom | Hex | Usage |
|-----|-----|-------|
| Obsidienne | `#1A1D24` | Fond principal, éléments forts |
| Champagne Perle | `#EBE5DF` | Fond secondaire, textes clairs |
| Sable Or Rosé | `#D9C7B8` | Accents, bordures, éléments dorés |
| Gris Ébène | `#232529` | Textes, ombres, UI secondaire |

## Palette « Neo-Luxe » (pages produit & collection — référence réelle)

| Nom | Hex | Usage |
|-----|-----|-------|
| Champagne Atelier | `#F9F8F6` | Fond des pages produit/collection (remplace le blanc pur) |
| Pierre claire | `#F5F5F4` / `stone-100` | Fonds d'images, états désactivés |
| Encre stone | `stone-900` | Titres, texte, CTA principal (fond noir) |
| Or discret | `amber-700/90` | Sur-titres / eyebrows (`uppercase tracking-widest`) |

## Éléments graphiques
- Filigrane géant et subtil "ATELIER" en arrière-plan, opacité ultra-douce.

## Boutons d'action (Double CTA)
- "Accéder à la Collection"
- "Réserver un Essayage"

## Typographie
- Titres : serif éditorial (Times New Roman, fallback serif).
- Texte courant : Inter / Sans-serif.

## Galerie produit (composant `ProductGallery`)
- Image principale : `aspect-[3/4]` mobile, `aspect-[4/5]` desktop, hauteur max `600px`.
- Colonne de miniatures à gauche (`lg:w-[90px]`), en **flex column** :
  - `ChevronUp` en haut → zone de défilement `flex-1 min-h-0 overflow-y-auto` → `ChevronDown` en bas.
  - Hauteur **synchronisée** à l'image principale via `ResizeObserver` (variable CSS `--thumb-height`).
  - Défilement fluide (`behavior: 'smooth'`), scrollbar discrète (`.custom-scrollbar`).
  - Mobile : miniatures en ligne horizontale défilable.
- Navigation image : flèches gauche/droite + compteur `n / N`.

## Page collection unifiée (`/collections` et `/collections/[handle]`)
- Deux routes, un **rendu unique** `CollectionView` (serveur) :
  - `/collections` → catalogue complet (handle `all`, `getProducts`), aucun 404.
  - `/collections/[handle]` → handle `all` = catalogue ; sinon collection ciblée.
- Bannière : fil d'Ariane, eyebrow doré, titre serif, description (HTML Shopify ou texte de repli), visuel optionnel `aspect-[4/3]`.
- **Layout asymétrique** : `lg:grid-cols-[260px_1fr]`.
  - Gauche : `CollectionFilters` sticky (`lg:sticky lg:top-24`) — **filtres basés sur les collections Shopify** (excluant 'lookbook') :
    - Catégories principales (ex: Femme / Mariée, Homme / Costumes, Alliances & Joaillerie, Ensembles Couple, Cortège) — cases à cocher.
    - Sous-catégories en accordéon (ex: Classique Royale, Édition Contemporaine, Silhouette Sirène & Dentelle sous Femme / Mariée).
    - Tri : Notre sélection, Prix ↑/↓, Nouveautés, Nom A→Z/Z→A.
  - Droite : `CollectionToolbar` (recherche + compteur) + grille **3 colonnes** (`grid-cols-1 sm:2 lg:3`).
- URL : `?category=...&subcategory=...&sort=...&q=...` (partageable/indexable).
- Cartes : `CollectionProductCard` — bordure délicate, ombre douce, zoom au survol, galerie interactive (flèches + points) si plusieurs visuels.
