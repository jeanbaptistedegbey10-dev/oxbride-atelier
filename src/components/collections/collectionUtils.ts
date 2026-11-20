/** @file
 * OXBride Atelier — Utilitaires de collection (tri, recherche, filtres collections).
 * Module partagé (sans directive 'use client') utilisé par la route serveur
 * `/collections` et par la route dynamique `/collections/[handle]`, ainsi que
 * par les composants clients `CollectionToolbar` et `CollectionFilters`.
 *
 * Les filtres sont basés sur les **collections Shopify réelles** (excluant 'lookbook').
 * Structure hiérarchique inférée par nommage :
 *   - Collections principales (ex: "Femme / Mariée", "Homme / Costumes", "Alliances & Joaillerie")
 *   - Sous-collections (ex: "Classique Royale", "Édition Contemporaine", "Silhouette Sirène & Dentelle")
 */

import type { LookbookProductData, CollectionFilterData } from '@/types/shopify';

/** Handle virtuel désignant l'intégralité du catalogue. */
export const ALL_COLLECTION_HANDLE = 'all';

/** Titre affiché pour le catalogue complet. */
export const ALL_COLLECTION_TITLE = 'Toutes les Pièces';

export interface SortOption {
  value: string;
  label: string;
}

/** Options de tri prises en charge par la page collection. */
export const COLLECTION_SORT_OPTIONS: SortOption[] = [
  { value: 'featured', label: 'Notre sélection' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'title-asc', label: 'Nom A → Z' },
  { value: 'title-desc', label: 'Nom Z → A' },
];

export const DEFAULT_COLLECTION_SORT = 'featured';

/** Valide / normalise le tri reçu depuis l'URL. */
export function resolveCollectionSort(value?: string | null): string {
  return value && COLLECTION_SORT_OPTIONS.some((option) => option.value === value)
    ? value
    : DEFAULT_COLLECTION_SORT;
}

/** Normalise un texte (minuscules, sans accents) pour la recherche. */
export function normalizeCollectionText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Extrait la valeur numérique du prix formaté ("199.00 EUR" → 199). */
export function collectionPriceValue(piece: LookbookProductData): number | null {
  const match = piece.price.match(/\d+(?:[.,]\d+)?/);
  if (!match) return null;
  const value = Number(match[0].replace(',', '.'));
  return Number.isFinite(value) ? value : null;
}

/** Filtre les pièces par recherche (titre normalisé). */
export function filterCollectionPieces(
  pieces: LookbookProductData[],
  query: string
): LookbookProductData[] {
  const normalizedQuery = normalizeCollectionText(query);
  if (!normalizedQuery) return pieces;
  return pieces.filter((piece) =>
    normalizeCollectionText(piece.title).includes(normalizedQuery)
  );
}

/* ============================================================================
   Filtres basés sur les collections Shopify (hiérarchie à 2 niveaux)
   ============================================================================ */

export interface CollectionFilterGroup {
  /** Clé du groupe (ex: 'femme-mariee', 'homme-costumes'). */
  key: string;
  /** Libellé affiché (ex: 'Femme / Mariée'). */
  label: string;
  /** Sous-collections (enfants) si applicable. */
  children: CollectionFilterOption[];
  /** Nombre total de produits dans ce groupe (tous enfants confondus). */
  productsCount: number;
}

export interface CollectionFilterOption {
  /** Handle de la collection (ex: 'femme-mariee-classique-royale'). */
  value: string;
  /** Titre affiché (ex: 'Classique Royale'). */
  label: string;
  /** Nombre de produits dans cette collection. */
  productsCount: number;
}

/** Sélection courante des filtres, synchronisée avec l'URL. */
export interface CollectionSelection {
  /** Handles de collections principales sélectionnées. */
  categories: string[];
  /** Handles de sous-collections sélectionnées. */
  subcategories: string[];
  /** Tri courant. */
  sort: string;
  /** Recherche textuelle. */
  q: string;
}

/**
 * Détermine si une collection est une "collection principale" (catégorie)
 * ou une "sous-collection" basé sur son titre.
 * Convention : les collections principales contiennent " / " dans leur titre
 * (ex: "Femme / Mariée") ou sont des collections "piliers" connues.
 */
function isMainCategory(title: string): boolean {
  const normalized = normalizeCollectionText(title);
  // Collections avec " / " dans le titre = catégories principales
  if (title.includes(' / ')) return true;
  // Collections piliers connues
  const mainTitles = [
    'femme mariee', 'homme costumes', 'alliances joaillerie',
    'ensembles couple', 'cortege', 'accessoires',
  ];
  return mainTitles.some((t) => normalized.includes(t));
}

/**
 * Extrait le libellé court pour une sous-collection.
 * Ex: "Femme / Mariée - Classique Royale" → "Classique Royale"
 * Ex: "Classique Royale" (si déjà court) → "Classique Royale"
 */
function extractSubLabel(fullTitle: string, parentTitle?: string): string {
  if (parentTitle && fullTitle.startsWith(parentTitle)) {
    // Format "Parent - Enfant" ou "Parent / Enfant"
    const rest = fullTitle.slice(parentTitle.length).trim();
    if (rest.startsWith('-') || rest.startsWith('/')) {
      return rest.slice(1).trim();
    }
    return rest;
  }
  return fullTitle;
}

/**
 * Organise les collections en groupes hiérarchiques (catégories + sous-catégories).
 * Exclut la collection 'lookbook'.
 */
export function buildCollectionFilterGroups(
  collections: CollectionFilterData[]
): CollectionFilterGroup[] {
  if (collections.length === 0) return [];

  // Séparer catégories principales et sous-collections
  const mains = collections.filter((c) => isMainCategory(c.title));
  const subs = collections.filter((c) => !isMainCategory(c.title));

  // Si aucune catégorie principale détectée, traiter toutes les collections comme principales
  // (robustesse : évite un panneau vide si la convention de nommage n'est pas respectée)
  const effectiveMains = mains.length > 0 ? mains : collections;
  const effectiveSubs = mains.length > 0 ? subs : [];

  // Pour chaque catégorie principale, trouver ses enfants
  const groups: CollectionFilterGroup[] = effectiveMains.map((main) => {
    const children = effectiveSubs
      .filter((sub) => {
        const subNorm = normalizeCollectionText(sub.title);
        const mainNorm = normalizeCollectionText(main.title);
        return subNorm.startsWith(mainNorm) || sub.handle.startsWith(main.handle);
      })
      .map((sub) => ({
        value: sub.handle,
        label: extractSubLabel(sub.title, main.title),
        productsCount: sub.productsCount,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'fr'));

    const totalCount = children.reduce((sum, c) => sum + c.productsCount, 0);

    return {
      key: main.handle,
      label: main.title,
      children,
      productsCount: totalCount || main.productsCount,
    };
  });

  // Ajouter les collections orphelines (sans parent détecté) comme catégories simples
  const orphanHandles = new Set(effectiveSubs.map((s) => s.handle));
  groups.forEach((g) => g.children.forEach((c) => orphanHandles.delete(c.value)));
  const orphans = effectiveSubs.filter((s) => orphanHandles.has(s.handle));
  orphans.forEach((orphan) => {
    groups.push({
      key: orphan.handle,
      label: orphan.title,
      children: [],
      productsCount: orphan.productsCount,
    });
  });

  // Trier : d'abord les catégories avec enfants, puis les orphelines, par label
  return groups.sort((a, b) => {
    if (a.children.length > 0 && b.children.length === 0) return -1;
    if (a.children.length === 0 && b.children.length > 0) return 1;
    return a.label.localeCompare(b.label, 'fr');
  });
}

/**
 * Filtre les produits selon la sélection de collections.
 * Un produit correspond s'il appartient à AU MOINS une des collections sélectionnées
 * (catégories OU sous-catégories).
 */
export function filterCollectionBySelection(
  pieces: LookbookProductData[],
  selection: CollectionSelection,
  allCollections: CollectionFilterData[]
): LookbookProductData[] {
  const activeCategories = new Set(selection.categories);
  const activeSubcategories = new Set(selection.subcategories);

  if (activeCategories.size === 0 && activeSubcategories.size === 0) {
    return pieces;
  }

  // Construire un map handle → collection pour lookup rapide
  const collectionByHandle = new Map(
    allCollections.map((c) => [c.handle, c])
  );

  return pieces.filter((piece) => {
    // Les produits ont des tags mais pas directement les handles de collections.
    // On doit matcher par titre de collection contenu dans les tags ou productType.
    // Fallback : si on ne peut pas matcher précisément, on laisse passer.
    const pieceTags = (piece.tags ?? []).map(normalizeCollectionText);
    const pieceType = piece.productType ? normalizeCollectionText(piece.productType) : '';

    // Vérifier les sous-catégories sélectionnées
    for (const subHandle of activeSubcategories) {
      const sub = collectionByHandle.get(subHandle);
      if (!sub) continue;
      const subNorm = normalizeCollectionText(sub.title);
      if (
        pieceTags.some((t) => t.includes(subNorm)) ||
        (pieceType && pieceType.includes(subNorm))
      ) {
        return true;
      }
    }

    // Vérifier les catégories principales sélectionnées
    for (const catHandle of activeCategories) {
      const cat = collectionByHandle.get(catHandle);
      if (!cat) continue;
      const catNorm = normalizeCollectionText(cat.title);
      if (
        pieceTags.some((t) => t.includes(catNorm)) ||
        (pieceType && pieceType.includes(catNorm))
      ) {
        return true;
      }
    }

    return false;
  });
}

/** Indique si au moins un filtre (collection ou tri) est actif. */
export function hasActiveCollectionFilters(
  selection: CollectionSelection
): boolean {
  return (
    selection.categories.length > 0 ||
    selection.subcategories.length > 0 ||
    selection.sort !== DEFAULT_COLLECTION_SORT
  );
}

/* ============================================================================
   (Dé)Sérialisation de la sélection depuis les paramètres d'URL
   ============================================================================ */

type RawSearchParams = Record<string, string | string[] | undefined>;

function readListParam(
  params: RawSearchParams,
  key: string
): string[] {
  const raw = params[key];
  const value = Array.isArray(raw) ? raw.join(',') : raw ?? '';
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/** Convertit les searchParams bruts en sélection typée. */
export function parseCollectionSelection(
  params: RawSearchParams
): CollectionSelection {
  return {
    categories: readListParam(params, 'category'),
    subcategories: readListParam(params, 'subcategory'),
    sort: resolveCollectionSort(
      typeof params.sort === 'string' ? params.sort : undefined
    ),
    q: typeof params.q === 'string' ? params.q.trim() : '',
  };
}

/** Trie une liste de pièces selon l'option choisie (ordre stable). */
export function sortCollectionPieces(
  pieces: LookbookProductData[],
  sort: string
): LookbookProductData[] {
  const sorted = [...pieces];
  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => {
        const pa = collectionPriceValue(a);
        const pb = collectionPriceValue(b);
        if (pa == null && pb == null) return 0;
        if (pa == null) return 1;
        if (pb == null) return -1;
        return pa - pb;
      });
      break;
    case 'price-desc':
      sorted.sort((a, b) => {
        const pa = collectionPriceValue(a);
        const pb = collectionPriceValue(b);
        if (pa == null && pb == null) return 0;
        if (pa == null) return 1;
        if (pb == null) return -1;
        return pb - pa;
      });
      break;
    case 'title-asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'fr'));
      break;
    case 'title-desc':
      sorted.sort((a, b) => b.title.localeCompare(a.title, 'fr'));
      break;
    default:
      break; // 'featured' et 'newest' → ordre d'origine conservé.
  }
  return sorted;
}