# OXBride Atelier — Design System

## Palette de couleurs « Neo-Luxe Lumineux »

| Nom | Hex | Usage |
|-----|-----|-------|
| Champagne | `#F9F8F6` | Fond principal (Hero, CTA final, pages produit/collection) |
| Sable chaud | `#F2ECE4` | Sections alternatives, filtres latéraux, widget réservation |
| Ivoire | `#FAF7F3` | Sections alternatives (FAQ, engagements) |
| Pierre | `#EFEAE4` | Footer, zones de transition, fonds de cartes secondaires |
| Profond chaud | `#2D2825` | Sections fortes (piliers, accents), texte blanc |
| Doré principal | `#9A7B5B` | Accents, eyebrows, éléments sélectionnés, coches, focus |
| Doré secondaire | `#C8B094` | Hover accents, bordures interactives, états subtils |
| Encre | `stone-900` | Titres, texte principal, CTA primaire (fond) |

> **Note** : L'ancienne palette sombre (`#1A1D24` obsidienne, `#D9C7B8` sable/or rosé, `#EBE5DF` champagne perle) est **dépréciée**. Le système visuel est désormais lumineux et nuancé.

## Éléments graphiques
- Filigrane géant et subtil "ATELIER" en arrière-plan, opacité ultra-douce.

## Boutons d'action (Double CTA)
- "Accéder à la Collection"
- "Réserver un Essayage"

## Typographie
- Titres : serif éditorial (Times New Roman, fallback serif).
- Texte courant : Inter / Sans-serif.
- Eyebrows : `text-[10px] uppercase tracking-[0.2em]` / `tracking-widest`, couleur `#9A7B5B`.

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
- Bannière : fil d'Ariane, eyebrow doré (`#9A7B5B`), titre serif, description (HTML Shopify ou texte de repli), visuel optionnel `aspect-[4/3]`.
- **Layout asymétrique** : `lg:grid-cols-[260px_1fr]`.
  - Gauche : `CollectionFilters` sticky (`lg:sticky lg:top-24`) — **filtres basés sur les collections Shopify** (excluant 'lookbook') :
    - Catégories principales (ex: Femme / Mariée, Homme / Costumes, Alliances & Joaillerie, Ensembles Couple, Cortège) — cases à cocher.
    - Sous-catégories en accordéon (ex: Classique Royale, Édition Contemporaine, Silhouette Sirène & Dentelle sous Femme / Mariée).
    - Tri : Notre sélection, Prix ↑/↓, Nouveautés, Nom A→Z/Z→A.
    - Accents sélection : `#9A7B5B` (fond/bordure), `#C8B094` (hover).
  - Droite : `CollectionToolbar` (recherche + compteur) + grille **3 colonnes** (`grid-cols-1 sm:2 lg:3`).
- URL : `?category=...&subcategory=...&sort=...&q=...` (partageable/indexable).
- Cartes : `CollectionProductCard` — bordure délicate, ombre douce, zoom au survol, galerie interactive (flèches + points) si plusieurs visuels.

## Footer global (`src/components/layout/Footer.tsx`)
- **Fond** : `bg-[#EFEAE4]` (pierre) avec accents `#9A7B5B` (doré principal) et `#C8B094` (doré secondaire), texte `stone-900`.
- **3 colonnes** : Identité + Newsletter | Collections | La Maison & Salons.
- **Newsletter** : champ e-mail + bouton, message de confirmation local, simulation API (à remplacer par endpoint réel).
- **Barre inférieure** : réseaux sociaux, mentions légales, copyright dynamique, retour en haut.
- **Règle critique** : toutes les icônes SVG **DOIVENT** avoir une taille fixe (`w-4 h-4` / `w-5 w-5`). Jamais d'icône sans dimension explicite.

## Page « L'Atelier » (`/latelier`)
- **Palette alternée** : sections en `bg-[#F9F8F6]` (champagne), `bg-[#F2ECE4]` (sable), `bg-[#FAF7F3]` (ivoire), piliers en `bg-[#2D2825]` (profond chaud, texte blanc).
- **Sections** :
  1. Hero : titre Serif, CTA double (Essayage / Savoir-Faire).
  2. Histoire & Philosophie : dialogue Paris ↔ Bénin, fondatrice Amélie Degbey.
  3. 4 Piliers : Croquis & Écoute, Toile & Coupe, Geste & Broderie, Assemblage & Finitions (grille 4 colonnes, fond `bg-[#2D2825]`).
  4. Matières : Satin Duchesse, Dentelle Calais-Caudry, Broderie Zardozi, Coton Bio Bénin, Organza, Laine Froide Super 150's (cartes `bg-white/60`).
  5. Deux Lieux : Salon Privé Paris (Vendôme) + Atelier Abomey-Calavi + CTA final.
- **Icônes** : toutes dimensionnées (`w-4 h-4` / `w-5 h-5`), `aria-hidden="true"`.

## Page « Sur-Mesure » (`/sur-mesure`)
- **Palette alternée** : Hero en `bg-[#F9F8F6]` (champagne), 4 piliers en `bg-[#2D2825]` (profond chaud, texte blanc, accents `#C8B094`), matières en `bg-[#F2ECE4]` (sable), engagements en `bg-[#FAF7F3]` (ivoire, coches `#9A7B5B`), CTA final en `bg-[#F9F8F6]`.
- **Sections** :
  1. Hero : titre Serif, CTA double (Rendez-vous / Collections).
  2. 4 Piliers : Dessin & Écoute, Matière & Coupe, Mesure & Ajustement, Finitions & Livraison (grille 4 colonnes).
  3. Matières d'Exception : grille 3 colonnes, cartes `bg-white/90`.
  4. Engagements : liste 6 points avec coches `text-[#9A7B5B]`.
  5. CTA Final : 3 boutons (Projet Sur-Mesure → modale, Rendez-vous, L'Atelier).
- **Modale projet Sur-Mesure** : formulaire complet → `POST /api/quotes` (type `sur-mesure`), référence `OXB-Q-XXXX`.
- **Icônes** : toutes dimensionnées (`w-4 h-4` / `w-5 h-5`), `aria-hidden="true"`.
- **Liens** : `/rendez-vous`, `/collections`, `/latelier`.

## Page « Rendez-vous » (`/rendez-vous`)
- **Palette alternée** : Hero en `bg-[#F9F8F6]` (champagne), widget en `bg-white/50`, privilèges en `bg-[#F2ECE4]` (sable), FAQ en `bg-[#FAF7F3]` (ivoire), CTA final en `bg-[#F9F8F6]`.
- **Widget interactif client** (`'use client'`) : parcours en 3 étapes avec indicateur (`StepIndicator`).
- **Étape 1** : sanctuaire (Paris `PAR` / Abomey-Calavi `BEN`) + prestation (5 types) — cartes sélectionnables avec coche.
- **Étape 2** : date (préavis **48h** calculé côté client, `min` sur l'input), créneau (liste partagée `APPOINTMENT_SLOTS`), nom, courriel, téléphone, accompagnants (0–4, compteur +/−). Bouton de confirmation désactivé si champs incomplets.
- **Étape 3** : écran de confirmation — récapitulatif + numéro de dossier `OXB-<PAR|BEN>-XXXX` généré aléatoirement, bouton de réinitialisation.
- **Sections** : Hero (CTA vers le widget + `/collections`), widget, Privilèges des salons (4 cartes), FAQ courte (`<details>`), CTA final (vers `/sur-mesure`).
- **Style** : titres Serif, cartes `bg-white/90` / `bg-white/70`, bordures `stone-200/80`, accents `#9A7B5B` / `#C8B094`, boutons `stone-900` (primaire) / transparent bordé (secondaire).
- **Icônes** : toutes dimensionnées (`w-4 h-4` / `w-5 h-5` / `w-7 h-7`), `aria-hidden="true"`.
- **Liens cohérents** : `/collections`, `/sur-mesure`, `/latelier`.

## Cohérence des routes & anti-404 (Navigation)
- **Route canonique** « L'Atelier » : `/latelier`. L'alias historique `/atelier` redirige vers `/latelier` (page `src/app/atelier/page.tsx` avec `redirect()`). Ne jamais lier `/atelier` dans le menu.
- **Menu** (`Header.tsx`) et **Footer** (`Footer.tsx`) : tout lien interne doit viser une route existante. Pages valides : `/`, `/collections` (+ `/collections/[handle]`), `/products/[handle]`, `/latelier` (alias `/atelier`), `/sur-mesure`, `/rendez-vous`, `/mentions-legales`, `/politique-confidentialite`, `/cgv`, `/accessibilite`.
- **Vérification obligatoire** : après toute modification de menu/liens, lister les `href="/..."` (grep) et confirmer qu'aucune cible ne produit de 404.
- Les liens `/collections/<handle>` passent par la route dynamique : handle inconnu = état vide élégant, jamais 404.

## Panier (Cart) — Slide-over drawer avec Checkout Storefront API
- **Provider** : `CartProvider` (context client) monté dans `layout.tsx` (au-dessus Header/Footer).
- **État** : lignes (variante + quantité), `isDrawerOpen`. Persistance `localStorage` (`oxb-cart-v1`), hydratation post-montage.
- **API** : `addItem(variante)`, `increment/decrement/remove(id)`, `count`, `subtotal`, `currencyCode`, `open/close/toggleDrawer()`, `createCheckout()`.
- **Tiroir** : panneau droit `fixed right-0 h-full max-w-md`, fond `#F9F8F6`, bordure `stone-200/80`.
  - Liste : image (aspect `[3/4]`), titre, variante, sélecteur `+/-` (w-8 h-8), suppression (poubelle w-4 h-4).
  - Sous-total formaté (Intl.NumberFormat fr-FR), CTA « Passer commande » → appelle `createCheckout()` :
    - **Mutation Shopify** : `cartCreate` avec `merchandiseId` (variante Storefront ID) + `quantity`.
    - **État chargement** : spinner `Loader2`, bouton désactivé.
    - **Succès** : redirection `window.location.href = checkoutUrl` (paiement Shopify).
    - **Échec / Mode démo** : message explicite (boutique protégée par mot de passe, variante sans ID Storefront, environnement portfolio) sans faire planter l'interface. Affichage `demoMode` contextuel.
    - Fermeture : overlay, bouton X, touche Échap.
- **Header** : icône `ShoppingBag` (w-4 h-4) + badge comptage (ambre) → clic = `openCart()`.
- **ProductInfo** : bouton « AJOUTER AU PANIER » (primary) + cœur `Heart` (w-5 w-5, outline/rempli) à droite. Clic bouton → `addItem()` + toast « Ajouté au panier » 2.2s.

## Liste de souhaits (Wishlist) — Slide-over drawer + Page dédiée `/wishlist`
- **Provider** : `WishlistProvider` (context client) même montage, clé `oxb-wishlist-v1`.
- **État** : `items: WishlistItem[]` (handle, title, price, imageUrl, imageAlt, link). Persistance `localStorage`.
- **API** : `toggle(item)`, `add(item)`, `remove(handle)`, `has(handle)`, `count`, `open/close/toggleDrawer()`.
- **Tiroir (`WishlistDrawer.tsx`)** : même grammaire visuelle (fond `#F9F8F6`, panneau droit). Liste : image, titre (lien), prix, cœur suppression. Lien « Voir la liste complète » → `/wishlist`. Vide : illustration + lien collections.
- **Header** : icône `Heart` (w-4 h-4) + badge comptage (ambre) → clic = `openWishlist()`. Navigation : « Mes souhaits » → `/wishlist`.
- **ProductInfo** : cœur discret à droite du bouton panier (w-5 w-5, `border`, `w-16`). Rempli si favori (`fill="currentColor"`).
- **CollectionProductCard** : cœur en haut à droite (z-20, `bg-white/70` → `bg-amber-500` quand favori). Toggle wishlist.

## Page « Liste de souhaits » (`/wishlist`)
- **Client Component** (`'use client'`) : hydratation sécurisée après montage.
- **Palette** : fond `bg-[#F9F8F6]` (champagne), sections alternatives `bg-[#F2ECE4]` / `bg-[#FAF7F3]`, cartes `bg-white/90`, accents `#9A7B5B` / `#C8B094`.
- **Contenu** :
  - Hero : titre Serif, compteur dynamique.
  - Grille responsive (1/2/3 colonnes) : cartes pièces avec image, titre, prix, actions (Retirer, Ajouter au panier → `CartProvider.addItem()`, Voir la pièce).
  - État vide : illustration `Heart`, CTA vers `/collections`.
  - CTA bas de page : « Continuer la découverte » → `/collections` + « Prolongez l'expérience en salon privé » → `/rendez-vous`.
- **Intégration** : `WishlistProvider` + `CartProvider`.
- **Icônes** : toutes dimensionnées (`w-4 h-4` / `w-5 h-5`), `aria-hidden="true"`.
- **Liens** : `/collections`, `/rendez-vous`, `/compte`.

## Espace Compte Client Local (`/compte`)
- **Client Component** (`'use client'`) : parcours complet (connexion / création / profil / suppression), hydratation post-montage.
- **Provider** : `AccountProvider` (`src/components/account/AccountProvider.tsx`) monté dans `layout.tsx`.
- **Session** : `oxb-account-auth-v1` (token Shopify si dispo, sinon token local + mode `shopify` | `local`).
- **Profil** : `oxb-account-v1` — prénom, nom, courriel, téléphone, ville, pays, lieu souhaité (PAR/BEN), prestation souhaitée, notes, `updatedAt`.
- **États UI** :
  - **Non connecté** : onglets « Se connecter » / « Créer un compte », formulaires avec états de chargement (`Loader2`) et messages (succès/erreur).
  - **Connecté** : en-tête profil + mode (`Compte connecté à la boutique` | `Mode portfolio (données locales)`), consultation (grille `dl`/`dd`) ↔ édition (formulaire complet), déconnexion.
  - **Suppression du compte** : confirmation en deux étapes, feedback d'erreur si Shopify refuse (repli local).
- **Intégration Shopify** : `POST /api/account/register|login|logout|update|delete` (mutations Storefront API `customerCreate` / `customerAccessTokenCreate` / `customerUpdate` / `customerAccessTokenDelete` / `customerDelete`).
  - Repli local automatique : si la boutique est en mode démo / protégée / scope client absent → `mode: 'local'`, l'UI reste fonctionnelle.
  - Identifiants de démonstration persistés dans `oxb-account-demo-v1`.
- **Liens rapides** : cartes vers `/wishlist` (avec compteur) et `/rendez-vous`.
- **Palette** : fond `bg-[#F9F8F6]`, sections alternatives `bg-[#F2ECE4]` / `bg-[#FAF7F3]`, cartes `bg-white/90`, accents `#9A7B5B` / `#C8B094`.
- **Icônes** : toutes dimensionnées (`w-4 h-4` / `w-5 h-5`), `aria-hidden="true"`.

## Header (`src/components/navigation/Header.tsx`) — Menu épuré & badges
- **Menu principal** (desktop + mobile) : uniquement `Collections`, `L'Atelier`, `Rendez-vous`.
  - Les liens texte « Mes souhaits » et « Mon compte » ont été **retirés** du menu.
- **Logo/Identité dans la barre (scroll only)** : `OXBRIDE ATELIER` + `PARIS · HAUTE COUTURE NUPTIALE` (lien vers `/`, police Cinzel, `tracking-[0.25em]`, `text-[#2D2825]`) — **apparaît uniquement au scroll > 0** (Framer Motion `opacity` + `x`), **disparaît en haut de page** (Hero visible).
- **Navigation centrée** : liens positionnés en `absolute left-1/2 -translate-x-1/2` pour un centrage parfait, `whitespace-nowrap` + `gap-5 lg:gap-6 xl:gap-8` — **jamais de chevauchement** avec les icônes droites à 1400 px comme à 1900 px.
- **Icônes à droite** : Recherche, **Compte** (`<Link href="/compte">` + `User`), **Liste de souhaits** (bouton `openWishlist()` + `Heart`), **Panier** (bouton `openCart()` + `ShoppingBag`) — **sélecteur de devise retiré**.
- **Espacement responsive ~1400px** : `gap-2 xl:gap-4`, `px-4 xl:px-8`, `shrink-0` sur chaque action — **zéro compression/superposition** à droite.
- **Badges chiffrés** (panier & wishlist) : `absolute -top-1 -right-1`, `h-4 w-4 min-w-[1.25rem]`, `text-[9px]`, fond `bg-amber-500` — **nets, lisibles, ne masquent pas l'icône**.
- **Arrière-plan au scroll** : transparent au Hero (`bg-transparent`, hover effects), **plein et opaque au scroll** (`bg-[#F9F8F6] border border-stone-200/80 shadow-lg`), textes/icônes en `text-[#2D2825]` pour contraste.
- **Scroll behavior** : barre masquée au **scroll vers le bas** (`scrollY > lastScrollY && scrollY > 100`), réapparue instantanément au **scroll vers le haut** — `isHeaderVisible` state + Framer Motion `y`/`opacity` animation.
- **Icônes** : toutes dimensionnées (`w-4 h-4` / `h-5 w-5` pour la croix mobile).
- **Liens** : `/wishlist`, `/rendez-vous`, `/collections`, `/sur-mesure`, `/latelier`.

## Hero (`src/components/hero/HeroCarousel.tsx`) — Logo & contrôles alignés
- **Logo top-gauche** : `OXBRIDE ATELIER` + `PARIS · HAUTE COUTURE NUPTIALE` **toujours visible** en `top-4 sm:top-5 left-6 md:left-12` (police Cinzel, blanc, `text-shadow`) — **aligné horizontalement avec le bloc de texte/contrôles du bas** (`md:left-12`).
- **FICHE COLLECTION aligné** : bouton unique à droite sur **la même ligne que le Header** (`top-4 sm:top-5 right-4 sm:right-6`), `shrink-0` + `whitespace-nowrap` — alignement parfait à 1400 px et 1900 px.
- **Autoplay permanent** : intervalle 4,8 s, **aucun bouton `AUTOPLAY` / `Pause`** dans l'UI.
- **Contrôles restants** : flèches nav, pagination points, CTA `DÉCOUVRIR LA COLLECTION`.

## Placement `/sur-mesure`
- **Présent uniquement dans le Footer** (`maisonLinks`), **jamais dans `Header.tsx`** (menu principal épuré : Collections, L'Atelier, Rendez-vous).
- Footer colonne « La Maison & Salons » : L'Atelier → **Sur-Mesure** → Rendez-vous & Salons Privés → ancres L'Atelier.

## API Routes — Réservations & Devis

### `POST /api/appointments` — Réservation rendez-vous
- **Endpoint** : `src/app/api/appointments/route.ts`
- **Input JSON** :
  ```ts
  {
    lieuId: 'PAR' | 'BEN',
    prestationId: string,           // ex: 'essayage-mariee'
    date: string,                   // 'YYYY-MM-DD' (≥ aujourd'hui + 48h)
    creneau: string,                // '10h30' | '11h45' | '14h00' | '15h30' | '17h00' | '18h15' (format HHhMM)
    nom: string,                    // ≥ 2 caractères
    email: string,                  // email valide
    telephone: string,              // ≥ 8 caractères
    accompagnants: number           // 0–4
  }
  ```
- **Validation serveur** : préavis 48h recalculé, créneaux dans `APPOINTMENT_SLOTS` (partagé via `src/lib/constants/appointments.ts`), email regex, téléphone, nom min 2.
- **Réponse succès (201)** :
  ```ts
  { success: true, dossier: 'OXB-PAR-XXXX', recap: { ... } }
  ```
- **Réponse erreur (422)** : `{ success: false, errors: string[] }`
- **Fallback sans SMTP/CRM** : journalisation `console.log` + succès simulé. Remplacer par envoi email / webhook CRM.
- **Intégration** : `src/app/rendez-vous/page.tsx` étape 3 → `fetch('/api/appointments')`, état `isSubmitting`, spinner, affichage `dossier` retourné.
- **Constantes partagées** : `src/lib/constants/appointments.ts` (`APPOINTMENT_SLOTS`, `PRESTATION_IDS`, `LIEU_IDS`, helpers `isValidSlot`, `normalizeSlot`).

### `POST /api/quotes` — Demande de devis / Sur-Mesure
- **Endpoint** : `src/app/api/quotes/route.ts`
- **Input JSON (type: 'produit')** :
  ```ts
  {
    type: 'produit',
    produitHandle: string,
    titre: string,
    variante: string,
    nom: string, email: string, telephone: string, message: string,
    lieuSouhaite?: 'PAR' | 'BEN',
    referrer?: string
  }
  ```
- **Input JSON (type: 'sur-mesure')** :
  ```ts
  {
    type: 'sur-mesure',
    titre: 'Projet Sur-Mesure',
    nom: string, email: string, telephone: string, message: string,
    lieuSouhaite?: 'PAR' | 'BEN',
    referrer?: string
  }
  ```
- **Validation** : champs requis selon type, email, téléphone, message ≥ 10 caractères.
- **Réponse succès (201)** : `{ success: true, reference: 'OXB-Q-XXXX', recap: {...} }`
- **Fallback** : journalisation locale + succès simulé.
- **Intégrations** :
  - `ProductInfo.tsx` : clic « SUR DEVIS » → `fetch('/api/quotes', { type: 'produit', ... })` + toast « Demande envoyée » 3s.
  - `src/app/sur-mesure/page.tsx` : modale → `fetch('/api/quotes', { type: 'sur-mesure', ... })` + écran succès dans la modale.

### Conventions API
- Routes sous `src/app/api/*/route.ts` (App Router Next.js 16).
- Validation manuelle stricte (style zod) + réponses structurées `{ success, data? | errors }`.
- Codes HTTP : 201 (créé), 400 (JSON invalide), 422 (validation), 500 (interne non exposé).
- Aucune clé secrète en dur ; futures variables d'env pour SMTP/CRM.

### `POST /api/checkout` — Création panier Storefront & Checkout URL
- **Endpoint** : `src/app/api/checkout/route.ts`
- **Input JSON** :
  ```ts
  {
    lines: Array<{
      merchandiseId: string,  // ID variante Shopify (ex: gid://shopify/ProductVariant/123)
      quantity: number        // ≥ 1
    }>
  }
  ```
- **Process** : appelle `createCartAndGetCheckoutUrl()` (mutation GraphQL `cartCreate`) via `src/lib/shopify/queries.ts`.
- **Réponse succès (200)** : `{ success: true, checkoutUrl: string }`
- **Réponse échec / mode démo (200)** : `{ success: false, errors: string[], demoMode: true }`
  - Ne retourne **pas** d'erreur HTTP 5xx pour ne pas casser l'UI côté client.
  - `demoMode: true` = boutique protégée par mot de passe, variante sans ID Storefront valide, ou environnement de développement sans token.
- **Fallback** : message explicite affiché dans `CartDrawer` (contexte portfolio).
- **Intégration** : `CartDrawer.tsx` → `useCart().createCheckout()` → état `isCheckingOut`, spinner, redirection `window.location.href` ou affichage erreur.

### API Compte Client (`/api/account/*`) — Création, Connexion, Mise à jour, Suppression
- Toutes sous `src/app/api/account/{register,login,logout,update,delete}/route.ts`.
- Utilisent les helpers de `src/lib/shopify/queries.ts` :
  - `createCustomer()` — mutation `customerCreate`.
  - `createCustomerAccessToken()` — mutation `customerAccessTokenCreate`.
  - `getCustomer()` — query `customer`.
  - `updateCustomer()` — mutation `customerUpdate`.
  - `deleteCustomerAccessToken()` — mutation `customerAccessTokenDelete`.
  - `deleteCustomer()` — mutation `customerDelete` (souvent non supportée en Storefront API standard).
- **Validation** : email regex, mot de passe ≥ 6, prénom/nom ≥ 2.
- **Réponses** : `{ success, mode: 'shopify'|'local', accessToken?, customer?, errors? }`.
  - **Toujours 200** pour ne pas casser l'UI ; `success: false` + `mode: 'local'` en cas d'échec Shopify (repli portfolio).
  - `update` retourne `success: true` même si Shopify échoue (le profil local est conservé).
  - `delete` retourne `success: false` + message si Shopify refuse (le provider bascule sur suppression locale).
- **Intégration** : `AccountProvider` appelle ces routes, gère le repli local, et persiste session/profil dans `localStorage`.