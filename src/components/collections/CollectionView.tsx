/** @file
 * OXBride Atelier — Vue de collection unifiée (Neo-Luxe Lumineux).
 * Composant serveur partagé par `/collections` (catalogue complet) et
 * `/collections/[handle]` (collection ciblée).
 *
 * - Bannière de collection (fil d'Ariane, eyebrow doré, titre serif,
 *   description, visuel optionnel) — fond champagne `bg-[#F9F8F6]`.
 * - Layout asymétrique : filtre latéral collant à gauche + zone principale — fond sable chaud `bg-[#F2ECE4]`.
 * - Zone principale : recherche + grille stricte de 3 colonnes.
 * - Filtres basés sur les collections Shopify (catégories + sous-catégories).
 *
 * Palette : accents dorés/sable `text-[#9A7B5B]` / `border-[#C8B094]`.
 */

import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import type { CollectionDetailData, CollectionFilterData } from '@/types/shopify';
import CollectionProductCard from './CollectionProductCard';
import CollectionFilters from './CollectionFilters';
import CollectionToolbar from './CollectionToolbar';
import {
  ALL_COLLECTION_HANDLE,
  COLLECTION_SORT_OPTIONS,
  buildCollectionFilterGroups,
  filterCollectionBySelection,
  filterCollectionPieces,
  hasActiveCollectionFilters,
  sortCollectionPieces,
  type CollectionSelection,
} from './collectionUtils';

interface CollectionViewProps {
  /** Données déjà récupérées par la route (catalogue ou collection). */
  collection: CollectionDetailData;
  /** Liste complète des collections pour les filtres (excluant lookbook). */
  allCollections: CollectionFilterData[];
  /** Sélection courante (filtres + tri + recherche), dérivée de l'URL. */
  selection: CollectionSelection;
}

export default function CollectionView({
  collection,
  allCollections,
  selection,
}: CollectionViewProps) {
  const isAll = collection.handle === ALL_COLLECTION_HANDLE;

  const filterGroups = buildCollectionFilterGroups(allCollections);
  const hasFilters = hasActiveCollectionFilters(selection);

  const pieces = sortCollectionPieces(
    filterCollectionBySelection(
      filterCollectionPieces(collection.products, selection.q),
      selection,
      allCollections
    ),
    selection.sort
  );

  const hasCollectionImage = Boolean(collection.imageUrl);
  const hasDescription =
    Boolean(collection.descriptionHtml) &&
    (collection.descriptionHtml ?? '').trim().length > 0;

  const fallbackDescription = isAll
    ? 'Découvrez l\'intégralité des créations OXBride Atelier : pièces de'
      + ' mariée, costumes d\'exception, alliances et joaillerie, confectionnées'
      + ' à la main dans notre atelier.'
    : 'Une sélection de pièces d\'exception issues de notre atelier.';

  // Pour le composant client CollectionFilters, créer un tableau simplifié
  const collectionsForFilters = allCollections.map((c) => ({
    handle: c.handle,
    title: c.title,
  }));

  return (
    <>
      {/* =======================================================================
          Bannière de collection
          ======================================================================= */}
      <section className="bg-[#F9F8F6] border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 md:pb-16">
          <nav className="flex items-center gap-1 text-xs font-sans uppercase tracking-widest text-stone-500">
            <Link href="/" className="hover:text-stone-900 transition-colors">
              Accueil
            </Link>
            <span className="mx-1 text-stone-300">/</span>
            <Link
              href="/collections"
              className="hover:text-stone-900 transition-colors"
            >
              Collections
            </Link>
            {!isAll && (
              <>
                <span className="mx-1 text-stone-300">/</span>
                <span className="text-stone-500 truncate">{collection.title}</span>
              </>
            )}
          </nav>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
            <div className="lg:col-span-7">
              <span className="block text-[10px] uppercase tracking-widest text-[#9A7B5B] font-sans font-medium mb-3">
                {isAll ? 'Le Catalogue' : 'Collection'}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1] tracking-tight text-stone-900">
                {collection.title}
              </h1>
              {!hasDescription && (
                <p className="mt-6 text-lg text-stone-700 leading-relaxed max-w-xl">
                  {fallbackDescription}
                </p>
              )}
              {hasDescription && (
                <div
                  className="mt-6 text-base text-stone-700 leading-relaxed max-w-xl space-y-3 [&_p]:leading-relaxed [&_a]:text-stone-900 [&_a]:underline [&_a]:underline-offset-4"
                  dangerouslySetInnerHTML={{
                    __html: collection.descriptionHtml ?? '',
                  }}
                />
              )}
            </div>

            {hasCollectionImage && (
              <div className="lg:col-span-5">
                <div className="relative w-full aspect-[16/10] lg:aspect-[4/3] rounded-3xl overflow-hidden border border-stone-200/60 bg-stone-100/40 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                  <Image
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    quality={95}
                    className="object-cover object-center"
                    src={collection.imageUrl}
                    alt={collection.imageAlt}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =======================================================================
          Filtres latéraux + grille 3 colonnes
          ======================================================================= */}
      <section className="bg-[#F2ECE4] border-t border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-12 items-start">
            {/* Colonne gauche — filtres (sticky desktop) */}
            <Suspense
              fallback={
                <div className="hidden lg:block h-96 animate-pulse rounded-2xl bg-stone-200/40" />
              }
            >
              <CollectionFilters
                groups={filterGroups}
                selection={selection}
                sortOptions={COLLECTION_SORT_OPTIONS}
                hasActiveFilters={hasFilters}
                allCollections={collectionsForFilters}
              />
            </Suspense>

            {/* Zone principale */}
            <div>
              <Suspense
                fallback={
                  <div className="mb-8 h-16 animate-pulse rounded-xl bg-stone-200/40" />
                }
              >
                <CollectionToolbar
                  initialQuery={selection.q}
                  total={pieces.length}
                  totalUnfiltered={collection.products.length}
                />
              </Suspense>

              {pieces.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pieces.map((piece, index) => (
                    <CollectionProductCard
                      key={piece.handle}
                      piece={piece}
                      priority={index < 3}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 mb-4">
                    Aucune pièce trouvée
                  </h2>
                  <p className="text-stone-600 max-w-md mx-auto">
                    {selection.q || hasFilters
                      ? 'Aucune création ne correspond à vos critères. Élargissez la sélection.'
                      : 'Cette collection ne contient pas encore de pièce.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}