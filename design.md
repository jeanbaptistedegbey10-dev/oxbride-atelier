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

## Footer global (`src/components/layout/Footer.tsx`)
- **Fond** : `bg-[#1A1D24]` (obsidienne profonde) avec accents `#D9C7B8` (sable/or rosé) et `#EBE5DF` (champagne poudré).
- **3 colonnes** : Identité + Newsletter | Collections | La Maison & Salons.
- **Newsletter** : champ e-mail + bouton, message de confirmation local, simulation API (à remplacer par endpoint réel).
- **Barre inférieure** : réseaux sociaux, mentions légales, copyright dynamique, retour en haut.
- **Règle critique** : toutes les icônes SVG **DOIVENT** avoir une taille fixe (`w-4 h-4` / `w-5 w-5`). Jamais d'icône sans dimension explicite.

## Page « L'Atelier » (`/latelier`)
- **Fond** : `bg-[#F9F8F6]` (champagne poudré), typo Serif, espacements `py-24` / `py-32`, bordures `border-stone-200/80`.
- **Sections** :
  1. Hero : titre Serif, CTA double (Essayage / Savoir-Faire).
  2. Histoire & Philosophie : dialogue Paris ↔ Bénin, fondatrice Amélie Degbey.
  3. 4 Piliers : Croquis & Écoute, Toile & Coupe, Geste & Broderie, Assemblage & Finitions (grille 4 colonnes, fond `stone-900`).
  4. Matières : Satin Duchesse, Dentelle Calais-Caudry, Broderie Zardozi, Coton Bio Bénin, Organza, Laine Froide Super 150's.
  5. Deux Lieux : Salon Privé Paris (Vendôme) + Atelier Abomey-Calavi + CTA final.
- **Icônes** : toutes dimensionnées (`w-4 h-4` / `w-5 h-5`), `aria-hidden="true"`.

## Cohérence des routes & anti-404 (Navigation)
- **Route canonique** « L'Atelier » : `/latelier`. L'alias historique `/atelier` redirige vers `/latelier` (page `src/app/atelier/page.tsx` avec `redirect()`). Ne jamais lier `/atelier` dans le menu.
- **Menu** (`Header.tsx`) et **Footer** (`Footer.tsx`) : tout lien interne doit viser une route existante. Pages valides : `/`, `/collections` (+ `/collections/[handle]`), `/products/[handle]`, `/latelier` (alias `/atelier`), `/sur-mesure`, `/rendez-vous`, `/mentions-legales`, `/politique-confidentialite`, `/cgv`, `/accessibilite`.
- **Pages « Sur-Mesure » (`/sur-mesure`) et « Rendez-vous » (`/rendez-vous`)** : même grammaire visuelle Neo-Luxe que `/latelier` (fond `#F9F8F6`, titres Serif, cartes `bg-white/60`, bordures `stone-200/80`, accents `amber-700/90`).
- **Vérification obligatoire** : après toute modification de menu/liens, lister les `href="/..."` (grep) et confirmer qu'aucune cible ne produit de 404.
- Les liens `/collections/<handle>` passent par la route dynamique : handle inconnu = état vide élégant, jamais 404.

## Page « Rendez-vous » (`/rendez-vous`)
- **Widget interactif client** (`'use client'`) : parcours en 3 étapes avec indicateur (`StepIndicator`).
- **Étape 1** : sanctuaire (Paris `PAR` / Abomey-Calavi `BEN`) + prestation (5 types) — cartes sélectionnables avec coche.
- **Étape 2** : date (préavis **48h** calculé côté client, `min` sur l'input), créneau (liste), nom, courriel, téléphone, accompagnants (0–4, compteur +/−). Bouton de confirmation désactivé si champs incomplets.
- **Étape 3** : écran de confirmation — récapitulatif + numéro de dossier `OXB-<PAR|BEN>-XXXX` généré aléatoirement, bouton de réinitialisation.
- **Sections** : Hero (CTA vers le widget + `/collections`), widget, Privilèges des salons (4 cartes), FAQ courte (`<details>`), CTA final (vers `/sur-mesure`).
- **Style** : fond `#F9F8F6`, titres Serif, cartes `bg-white/60` / `bg-white/70`, bordures `stone-200/80`, accents `amber-700/90`, boutons `stone-900` (primaire) / transparent bordé (secondaire).
- **Icônes** : toutes dimensionnées (`w-4 h-4` / `w-5 h-5` / `w-7 h-7`), `aria-hidden="true"`.
- **Liens cohérents** : `/collections`, `/sur-mesure`, `/latelier`.
