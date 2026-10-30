# 🔐 Permissions Storefront API — Metaobjects (Shopify Admin)

Ce document recense les réglages nécessaires dans l'**administration Shopify** pour que l'application headless Next.js puisse lire le méta-objet `editorial_manifeste` via la Storefront API.

## 1. Contexte

Le jeton `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` (Stockage : `.env.local`) est un **jeton d'accès public Storefront** (Storefront API access token). Il est utilisé côté client/serveur Next.js pour interroger l'endpoint :

```
https://<domaine>.myshopify.com/api/2024-10/graphql.json
```

Ce jeton possède des **permissions limitées** (unauthenticated read access). Par défaut, il ne peut **pas** lire les méta-objets (`Metaobject`) tant que la permission n'est pas explicitement accordée dans l'application Shopify.

## 2. Permission requise : Metaobjects — Lecture non authentifiée

Dans **Shopify Admin > Apps > [Votre application custom / headless] > Configuration des API Storefront** :

| Permission | Valeur requise | Description |
|---|---|---|
| **Metaobjects** | `Unauthenticated read access` | Permet à la Storefront API de lire les méta-objets et leurs champs. |
| **Metafields** (optionnel) | `Unauthenticated read access` | Peut être nécessaire si des métachamps liés sont interrogés. |

> ⚠️ Si seule la permission "Metaobjects" est absente, Shopify retourne une erreur GraphQL avec le code `ACCESS_DENIED` et le champ `metaobject` vaut `null`.

## 3. Vérification du méta-objet ciblé

La requête GraphQL dans `src/lib/shopify/queries.ts` interroge :

```graphql
query GetEditorialManifesto($handle: MetaobjectHandleInput!) {
  metaobject(handle: $handle) {
    id
    handle
    type
    fields { key value reference { ... } }
  }
}
```

avec les variables :

```json
{ "handle": { "handle": "editorial_manifeste", "type": "editorial_manifeste" } }
```

Dans **Shopify Admin > Contenu > Métaobjets** (ou Paramètres > Données personnalisées > Métaobjets) :

1. Vérifier qu'un méta-objet existe avec :
   - **Type** : `editorial_manifeste`
   - **Handle de l'entrée** : `editorial_manifeste`
2. Vérifier que les champs contiennent les clés attendues (voir `src/types/shopify.ts` `FIELD_ALIASES`) :
   - `titre` / `title`
   - `sous_titre` / `subtitle`
   - `citation` / `quote`
   - `signature`
   - `visuel_atelier` (référence image)
3. Vérifier que le méta-objet est **publié** (status actif).

## 4. Diagnostic avec les logs ajoutés

Après les modifications apportées à `src/lib/shopify/client.ts` et `src/lib/shopify/queries.ts`, la console du navigateur (en `development`) affiche désormais :

- `[ShopifyFetch] Requête Storefront API` — variables envoyées (handle + type)
- `[ShopifyFetch] Réponse HTTP` — status et `ok`
- `[ShopifyFetch] Erreurs GraphQL détaillées` — avec `code` (ex: `ACCESS_DENIED`) et `type`
- `[EditorialManifesto] Appel Shopify` — handle/type utilisés
- `[EditorialManifesto] Réponse Shopify brute` — `metaobject` null ou non, `fieldsCount`
- `[EditorialManifesto] Erreur Shopify Storefront API` — message complet + stack

**Cas typiques :**

| Symptôme dans les logs | Cause probable | Action |
|---|---|---|
| `code: "ACCESS_DENIED"` | Permission Storefront manquante | Activer "Metaobjects — Unauthenticated read access" dans Shopify Admin |
| `metaobject: null` sans erreur GraphQL | Handle ou type incorrect | Vérifier le handle et le type dans Shopify Admin > Métaobjets |
| `status: 401` | Token Storefront invalide ou manquant | Vérifier `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` dans `.env.local` |
| `status: 403` | Boutique verrouillée / mot de passe | Désactiver la protection par mot de passe de la boutique ou ajouter le header approprié |

## 5. Après correction

Dès que la permission est activée et/ou que le handle/type sont corrects :

1. La requête retourne le méta-objet avec ses `fields`.
2. `parseEditorialManifesto` extrait `titre`, `sousTitre`, `citation`, `signature`, `visuelUrl`.
3. Le composant `EditorialManifesto` affiche les données Shopify **à la place du fallback statique** (`EDITORIAL_FALLBACK`).
4. La console affiche : `[EditorialManifesto] Données affichées : { source: 'Shopify', ... }`

## 6. Rebuild après modification des permissions

Les permissions Storefront API se mettent à jour côté Shopify (aucun rebuild Next.js requis pour la permission elle-même), mais un redémarrage du serveur de dev est recommandé pour prendre en compte les nouveaux logs :

```bash
pnpm dev
# ou pour valider la production :
pnpm build
```
