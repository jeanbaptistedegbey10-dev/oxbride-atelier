/**
 * OXBride Atelier â€” RequÃªtes GraphQL Storefront API
 * MÃ©ta-objet : editorial_manifeste
 *
 * - Utilise par dÃ©faut une requÃªte de liste `metaobjects(type: $type, first: 1)`
 *   qui ne dÃ©pend PAS du handle exact de l'entrÃ©e. Ceci Ã©vite dÃ©finitivement
 *   les erreurs de correspondance (handle figÃ© vs handle rÃ©el dans Shopify Admin).
 * - Si un handle explicite est fourni, on tente d'abord la requÃªte directe
 *   `metaobject(handle: $handle)` puis on bascule sur la liste en cas de null.
 * - `value` est un scalaire String : on ne sÃ©lectionne JAMAIS de sous-champs dessus.
 * - Les rÃ©fÃ©rences de fichiers/images se rÃ©cupÃ¨rent via le champ `reference`
 *   (union MetafieldReference qui inclut MediaImage) avec un fragment en ligne.
 */

import { shopifyFetch } from './client';
import { parseEditorialManifesto } from '@/types/shopify';
import type {
  CollectionData,
  EditorialManifestoData,
  LookbookProductData,
  PrivateSalonExperienceData,
  ShopifyCollectionNode,
  ShopifyMetaobject,
} from '@/types/shopify';
import {
  PRIVATE_SALON_FALLBACK,
  SALON_FIELD_ALIASES,
  normalizeShopifyKey,
} from '@/types/shopify';

/**
 * RequÃªte de liste : rÃ©cupÃ¨re la premiÃ¨re entrÃ©e du type donnÃ©.
 * TolÃ©rante aux erreurs de handle â€” on prend simplement nodes[0].
 */
export const EDITORIAL_MANIFESTES_QUERY = `
  query GetEditorialManifestos($type: String!) {
    metaobjects(type: $type, first: 1) {
      nodes {
        id
        handle
        type
        fields {
          key
          value
          reference {
            __typename
            ... on MediaImage {
              image {
                url
                altText
              }
            }
            ... on GenericFile {
              url
            }
          }
        }
      }
    }
  }
`;

/**
 * RequÃªte directe par handle (conservÃ©e pour compatibilitÃ© / ciblage prÃ©cis).
 */
export const EDITORIAL_MANIFESTE_QUERY = `
  query GetEditorialManifesto($handle: MetaobjectHandleInput!) {
    metaobject(handle: $handle) {
      id
      handle
      type
      fields {
        key
        value
        reference {
          __typename
          ... on MediaImage {
            image {
              url
              altText
            }
          }
          ... on GenericFile {
            url
          }
        }
      }
    }
  }
`;

export interface GetEditorialManifestoOptions {
  handle?: string;
  type?: string;
  cache?: RequestCache;
}

/**
 * RÃ©cupÃ¨re l'entrÃ©e du mÃ©ta-objet editorial_manifeste depuis la Storefront API.
 *
 * StratÃ©gie :
 * 1. Si un handle explicite est fourni â†’ tentative de requÃªte directe par handle.
 * 2. Si la directe retourne null ou qu'aucun handle n'est fourni â†’ requÃªte de liste
 *    par type, extraction du premier nÅ“ud (nodes[0]).
 *
 * Retourne null en cas d'erreur ou d'absence de donnÃ©e (fallback gÃ©rÃ© par l'appelant).
 */
export async function getEditorialManifesto({
  handle,
  type = 'editorial_manifeste',
  cache = 'no-store',
}: GetEditorialManifestoOptions = {}): Promise<EditorialManifestoData | null> {
  // â”€â”€ 1. RequÃªte directe par handle (si fournie) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (handle) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[EditorialManifesto] Appel Shopify (direct) :', {
        handle,
        type,
        cache,
        query: EDITORIAL_MANIFESTE_QUERY.trim(),
        variables: { handle: { handle, type } },
      });
    }

    try {
      const data = await shopifyFetch<{ metaobject: ShopifyMetaobject | null }>(
        EDITORIAL_MANIFESTE_QUERY,
        { handle: { handle, type } },
        { cache }
      );

      if (process.env.NODE_ENV === 'development') {
        console.log('[EditorialManifesto] RÃ©ponse Shopify (direct) :', {
          metaobject: data.metaobject,
          metaobjectNull: data.metaobject === null,
        });
      }

      if (data.metaobject) {
        return parseEditorialManifestoFromMetaobject(data.metaobject);
      }
      // Sinon : on bascule sur la requÃªte de liste ci-dessous.
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[EditorialManifesto] Erreur Shopify (direct) :', error);
      }
      // On continue vers la requÃªte de liste.
    }
  }

  // â”€â”€ 2. RequÃªte de liste par type (plus tolÃ©rante, handle non requis) â”€â”€â”€â”€
  if (process.env.NODE_ENV === 'development') {
    console.log('[EditorialManifesto] Appel Shopify (liste) :', {
      type,
      cache,
      query: EDITORIAL_MANIFESTES_QUERY.trim(),
      variables: { type },
    });
  }

  try {
    const data = await shopifyFetch<{ metaobjects: { nodes: ShopifyMetaobject[] } }>(
      EDITORIAL_MANIFESTES_QUERY,
      { type },
      { cache }
    );

    if (process.env.NODE_ENV === 'development') {
      console.log('[EditorialManifesto] RÃ©ponse Shopify (liste) :', {
        nodes: data.metaobjects?.nodes,
        nodesLength: data.metaobjects?.nodes?.length ?? 0,
        firstHandle: data.metaobjects?.nodes?.[0]?.handle,
      });
    }

    const firstMetaobject = data.metaobjects?.nodes?.[0] ?? null;
    return parseEditorialManifestoFromMetaobject(firstMetaobject);
  } catch (error) {
    // En cas d'indisponibilitÃ© du shop / rÃ©seau / build hors-ligne, on retourne
    // null pour que le composant affiche son fallback statique Ã©lÃ©gant.
    if (process.env.NODE_ENV === 'development') {
      console.error('[EditorialManifesto] Erreur Shopify Storefront API (liste) :', {
        type,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
    return null;
  }
}

/** Parseur local sÃ©parÃ© pour rester testable et dÃ©couplÃ© de fetch. */
export function parseEditorialManifestoFromMetaobject(
  metaobject: ShopifyMetaobject | null
): EditorialManifestoData | null {
  return parseEditorialManifesto(metaobject);
}

/* ============================================================================
   MÃ©ta-objet : private_salon_experience (Salon PrivÃ©)
   ============================================================================ */

/**
 * RequÃªte de liste : rÃ©cupÃ¨re la premiÃ¨re entrÃ©e du type private_salon_experience.
 * TolÃ©rante aux erreurs de handle â€” on prend simplement nodes[0].
 */
export const PRIVATE_SALON_EXPERIENCES_QUERY = `
  query GetPrivateSalonExperiences($type: String!) {
    metaobjects(type: $type, first: 1) {
      nodes {
        id
        handle
        type
        fields {
          key
          value
        }
      }
    }
  }
`;

/**
 * RÃ©cupÃ¨re l'entrÃ©e du mÃ©ta-objet private_salon_experience depuis la Storefront API.
 * Retourne null en cas d'erreur ou d'absence de donnÃ©e (fallback gÃ©rÃ© par l'appelant).
 */
export async function getPrivateSalonExperience({
  type = 'private_salon_experience',
  cache = 'no-store',
}: { type?: string; cache?: RequestCache } = {}): Promise<PrivateSalonExperienceData> {
  if (process.env.NODE_ENV === 'development') {
    console.log('[PrivateSalon] Appel Shopify :', { type, cache });
  }

  try {
    const data = await shopifyFetch<{ metaobjects: { nodes: ShopifyMetaobject[] } }>(
      PRIVATE_SALON_EXPERIENCES_QUERY,
      { type },
      { cache }
    );

    const firstMetaobject = data.metaobjects?.nodes?.[0] ?? null;
    const parsed = parsePrivateSalonExperienceFromMetaobject(firstMetaobject);
    if (parsed) {
      return parsed;
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[PrivateSalon] Erreur Shopify Storefront API :', {
        type,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // Fallback si le mÃ©ta-objet est introuvable ou en cas d'erreur
  return PRIVATE_SALON_FALLBACK;
}

/** Parseur local pour le mÃ©ta-objet private_salon_experience. */
export function parsePrivateSalonExperienceFromMetaobject(
  metaobject: ShopifyMetaobject | null
): PrivateSalonExperienceData | null {
  if (!metaobject || !metaobject.fields?.length) {
    return null;
  }

  // Index des champs par clÃ© normalisÃ©e : tolÃ©rant Ã  la casse, aux underscores,
  // espaces et tirets (ex: "Location 1 Title" â‰¡ "location_1_title").
  const fieldByKey = new Map<string, string>();
  for (const field of metaobject.fields) {
    if (field.key && field.value != null && field.value !== '') {
      fieldByKey.set(normalizeShopifyKey(field.key), field.value);
    }
  }

  const getString = (key: string): string | null => fieldByKey.get(normalizeShopifyKey(key)) ?? null;

  const data: Partial<PrivateSalonExperienceData> = {};

  for (const [target, aliases] of Object.entries(SALON_FIELD_ALIASES)) {
    for (const alias of aliases) {
      const value = getString(alias);
      if (value) {
        data[target as keyof PrivateSalonExperienceData] = value;
        break;
      }
    }
  }

  // Obligatoire : titre et description pour considÃ©rer la donnÃ©e comme valide
  if (!data.titre || !data.description) {
    return null;
  }

  return data as PrivateSalonExperienceData;
}

/**
 * RequÃªte : produits d'une collection Shopify ciblÃ©e par son handle.
 * RÃ©cupÃ¨re jusqu'Ã  12 produits avec image en vedette et prix.
 */
/* ============================================================================
   Produits — Requêtes Storefront API
   ============================================================================ */

/**
 * Requête : liste des produits actifs de la boutique.
 * Récupère jusqu'à `first` produits avec image en vedette et prix.
 */
export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!) {
    products(first: $first, sortKey: TITLE, reverse: false) {
      nodes {
        id
        handle
        title
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

export interface GetProductsOptions {
  /** Nombre maximal de produits à récupérer (défaut : 12). */
  first?: number;
  cache?: RequestCache;
}

/**
 * Récupère les premiers produits actifs de la boutique depuis la Storefront API.
 * Utilisé comme fallback intelligent quand la collection lookbook est vide.
 * Retourne un tableau vide en cas d'erreur ou d'absence de produit.
 */
export async function getProducts({
  first = 12,
  cache = 'no-store',
}: GetProductsOptions = {}): Promise<LookbookProductData[]> {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Products] Appel Shopify :', { first, cache });
  }

  try {
    const data = await shopifyFetch<{ products: { nodes: LookbookProductNode[] } }>(
      PRODUCTS_QUERY,
      { first },
      { cache }
    );

    const nodes = (data.products?.nodes ?? []).filter(Boolean);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Products] ${nodes.length} produit(s) reçu(s)`);
    }

    return nodes.map((node) => ({
      id: node.id,
      handle: node.handle,
      title: node.title,
      price:
        node.priceRange?.minVariantPrice != null
          ? `${node.priceRange.minVariantPrice.amount} ${node.priceRange.minVariantPrice.currencyCode}`
          : 'Sur devis',
      imageUrl: node.featuredImage?.url ?? '',
      imageAlt: node.featuredImage?.altText ?? node.title,
      images:
        node.images?.edges
          ?.map((edge) => ({
            url: edge.node.url,
            altText: edge.node.altText ?? node.title,
          }))
          .filter(Boolean) ?? [],
      link: `/products/${node.handle}`,
    }));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[Products] Échec de la récupération des produits :',
        error instanceof Error ? error.message : String(error)
      );
    }
    return [];
  }
}

export const LOOKBOOK_COLLECTION_PRODUCTS_QUERY = `
  query GetLookbookCollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      handle
      title
      products(first: $first, sortKey: TITLE, reverse: false) {
        nodes {
          id
          handle
          title
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            url
            altText
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * RequÃªte : recherche de produits par tag (fallback si aucune collection lookbook).
 * Utilise l'argument `query` de la Storefront API avec `tag:lookbook`.
 */
export const LOOKBOOK_PRODUCTS_BY_TAG_QUERY = `
  query GetLookbookProductsByTag($tag: String!) {
    products(first: 12, sortKey: TITLE, reverse: false, query: $tag) {
      nodes {
        id
        handle
        title
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

/**
 * Handles de collection lookbook acceptÃ©s, essayÃ©s par ordre de prioritÃ©
 * tant que la collection ciblÃ©e est introuvable ou ne renvoie aucun produit.
 */
export const LOOKBOOK_COLLECTION_HANDLES: string[] = [
  'lookbook',
  'le-lookbook',
  'look-book',
  'lookbooks',
];

/** RÃ©ponse brute de la requÃªte collection lookback (Storefront API). */
export interface LookbookPriceRangeNode {
  minVariantPrice: {
    amount: string;
    currencyCode: string;
  } | null;
}

export interface LookbookProductNode {
  id: string;
  handle: string;
  title: string;
  priceRange: LookbookPriceRangeNode | null;
  featuredImage: { url: string; altText: string | null } | null;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  } | null;
}

export interface LookbookCollectionResponse {
  collection: {
    id: string;
    handle: string;
    title: string;
    products: {
      nodes: LookbookProductNode[];
    } | null;
  } | null;
}

export interface GetLookbookProductsOptions {
  /** Handle unique (rÃ©tro-compatibilitÃ©, essayÃ© en premier s'il est fourni). */
  handle?: string;
  /** Handles de collection candidats, essayÃ©s par ordre de prioritÃ©. */
  handles?: string[];
  /** Nombre maximal de produits à rÃ©cupÃ©rer. */
  first?: number;
  cache?: RequestCache;
}

/**
 * RÃ©cupÃ¨re les produits de la collection lookbook depuis la Storefront API.
 * Retourne null en cas dâ€™erreur ou dâ€™absence de donnÃ©e.
 */
const DEFAULT_LOOKBOOK_HANDLES: string[] = [
  'lookbook',
  'le-lookbook',
  'look-book',
  'lookbooks',
];

/**
 * RÃ©cupÃ¨re les produits de la collection lookbook depuis la Storefront API.
 *
 * Interroge directement la collection au handle exact `lookbook` :
 *   collection(handle: "lookbook") { products(first: 12) { ... } }
 *
 * Si la collection est introuvable ou ne renvoie aucun produit, bascule
 * sur les 12 premiers produits actifs de la boutique (`getProducts`) afin
 * d'alimenter la grille avec de vrais produits Shopify. Aucune donnée
 * statique ni fictive n'est retournée : le tableau est vide en cas d'échec.
 */
export async function getLookbookProducts({
  handle = 'lookbook',
  first = 12,
  cache = 'no-store',
}: GetLookbookProductsOptions = {}): Promise<LookbookProductData[]> {
  // 1. Requête directe : collection lookbook par handle
  try {
    const data = await shopifyFetch<LookbookCollectionResponse>(
      LOOKBOOK_COLLECTION_PRODUCTS_QUERY,
      { handle, first },
      { cache }
    );
    const products = (data.collection?.products?.nodes ?? []).filter(Boolean);
    if (products.length > 0) {
      return products.map((node) => ({
        id: node.id,
        handle: node.handle,
        title: node.title,
        price:
          node.priceRange?.minVariantPrice != null
            ? `${node.priceRange.minVariantPrice.amount} ${node.priceRange.minVariantPrice.currencyCode}`
            : 'Sur devis',
        imageUrl: node.featuredImage?.url ?? '',
        imageAlt: node.featuredImage?.altText ?? node.title,
        images:
          node.images?.edges
            ?.map((edge) => ({
              url: edge.node.url,
              altText: edge.node.altText ?? node.title,
            }))
            .filter(Boolean) ?? [],
        link: `/products/${node.handle}`,
      }));
    }
  } catch {
    // Échec silencieux : bascule immédiate sur la stratégie globale ci-dessous.
  }
  // 2. Filtrage optionnel par tag « lookbook » sur les produits de la boutique.
  try {
    const data = await shopifyFetch<{ products: { nodes: LookbookProductNode[] } }>(
      LOOKBOOK_PRODUCTS_BY_TAG_QUERY,
      { tag: 'tag:lookbook' },
      { cache }
    );
    const tagged = (data.products?.nodes ?? []).filter(Boolean);
    if (tagged.length > 0) {
      return tagged.map((node) => ({
        id: node.id,
        handle: node.handle,
        title: node.title,
        price:
          node.priceRange?.minVariantPrice != null
            ? `${node.priceRange.minVariantPrice.amount} ${node.priceRange.minVariantPrice.currencyCode}`
            : 'Sur devis',
        imageUrl: node.featuredImage?.url ?? '',
        imageAlt: node.featuredImage?.altText ?? node.title,
        images:
          node.images?.edges
            ?.map((edge) => ({
              url: edge.node.url,
              altText: edge.node.altText ?? node.title,
            }))
            .filter(Boolean) ?? [],
        link: `/products/${node.handle}`,
      }));
    }
  } catch {
    // Échec silencieux : bascule immédiate sur les produits généraux.
  }
  // 3. Fallback intelligent : 12 premiers produits actifs de la boutique.
  let boutiqueProducts: LookbookProductData[] = [];
  try {
    boutiqueProducts = await getProducts({ first: 12, cache });
  } catch {
    boutiqueProducts = [];
  }
  if (boutiqueProducts.length > 0) {
    return boutiqueProducts;
  }
  // 4. Dernier recours : fallback statique figé.
  return [];
}

/* ============================================================================
   Collections â€” RequÃªtes Storefront API
   ============================================================================ */

/**
 * RequÃªte : liste des collections publiques de la boutique.
 * `sortKey` (ex: `TITLE`, `UPDATED_AT`) et `reverse` pour un ordre Ã©ditorial stable.
 */
export const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!, $reverse: Boolean!) {
    collections(first: $first, sortKey: TITLE, reverse: $reverse) {
      nodes {
        id
        handle
        title
        descriptionHtml
        image {
          url
          altText
        }
        products(first: 4) {
          nodes {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            featuredImage {
              url
              altText
            }
          }
        }
      }
    }
  }
`;

export interface GetCollectionsOptions {
  first?: number;
  reverse?: boolean;
  cache?: RequestCache;
}

/**
 * RÃ©cupÃ¨re les collections publiques depuis la Storefront API.
 * Retourne null en cas dâ€™erreur ou dâ€™absence de donnÃ©e (fallback statique
 * gÃ©rÃ© par le composant appelant).
 */
export async function getCollections({
  first = 12,
  reverse = false,
  cache = 'no-store',
}: GetCollectionsOptions = {}): Promise<CollectionData[] | null> {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Collections] Appel Shopify :', { first, reverse, cache });
  }

  try {
    const data = await shopifyFetch<{ collections: { nodes: ShopifyCollectionNode[] } }>(
      COLLECTIONS_QUERY,
      { first, reverse },
      { cache }
    );

    const nodes = data.collections?.nodes ?? [];

    if (process.env.NODE_ENV === 'development') {
      console.log('[Collections] RÃ©ponse Shopify :', { nodesLength: nodes.length });
    }

    return nodes.map((node) => ({
      id: node.id,
      handle: node.handle,
      title: node.title,
      subtitle: '',
      description: node.descriptionHtml ?? '',
      link: `/collections/${node.handle}`,
      imageUrl: node.image?.url ?? '',
      imageAlt: node.image?.altText ?? node.title,
    }));
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Collections] Échec Shopify Storefront API :', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
    return null;
  }
}

