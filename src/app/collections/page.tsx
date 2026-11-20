/** @file
 * OXBride Atelier — Page index des collections (Neo-Luxe).
 * Route : /collections
 *
 * Affiche directement le catalogue complet (handle virtuel `all`) afin que
 * tout accès direct à `/collections` arrive sans erreur 404 sur l'intégralité
 * des pièces. Les filtres (collections), le tri et la recherche sont synchronisés
 * avec l'URL via `CollectionView` / `CollectionFilters`.
 */

import { getCollectionsWithCount, getProducts } from '@/lib/shopify/queries';
import type { CollectionDetailData, CollectionFilterData } from '@/types/shopify';
import CollectionView from '@/components/collections/CollectionView';
import {
  ALL_COLLECTION_HANDLE,
  ALL_COLLECTION_TITLE,
  parseCollectionSelection,
} from '@/components/collections/collectionUtils';

// Rendement dynamique : la page dépend des searchParams (filtres / tri / recherche).
export const instant = false;

interface CollectionsIndexPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CollectionsIndexPage({
  searchParams,
}: CollectionsIndexPageProps) {
  const selection = parseCollectionSelection(await searchParams);

  // Récupérer le catalogue complet
  const products = await getProducts({ first: 60 });

  // Récupérer toutes les collections pour les filtres (excluant lookbook)
  const allCollections = await getCollectionsWithCount({ first: 50 });

  const collection: CollectionDetailData = {
    id: ALL_COLLECTION_HANDLE,
    handle: ALL_COLLECTION_HANDLE,
    title: ALL_COLLECTION_TITLE,
    descriptionHtml: null,
    imageUrl: '',
    imageAlt: ALL_COLLECTION_TITLE,
    products,
  };

  return (
    <main className="min-h-screen bg-[#F9F8F6] text-stone-900">
      <CollectionView
        collection={collection}
        allCollections={allCollections}
        selection={selection}
      />
    </main>
  );
}