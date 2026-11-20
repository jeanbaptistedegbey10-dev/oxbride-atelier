/** @file
 * OXBride Atelier — Page de collection (Neo-Luxe).
 * Route : /collections/[handle]
 *
 * - Handle `all`  → catalogue complet (tous les produits actifs).
 * - Handle précis → produits filtrés de la collection correspondante.
 *
 * Le rendu (bannière, filtres latéraux, tri/recherche, grille 3 colonnes) est
 * délégué au composant serveur partagé `CollectionView`, identique à la route
 * `/collections`.
 */

import { notFound } from 'next/navigation';
import {
  getCollectionProducts,
  getCollectionsWithCount,
  getProducts,
} from '@/lib/shopify/queries';
import type { CollectionDetailData, CollectionFilterData } from '@/types/shopify';
import CollectionView from '@/components/collections/CollectionView';
import {
  ALL_COLLECTION_HANDLE,
  ALL_COLLECTION_TITLE,
  parseCollectionSelection,
} from '@/components/collections/collectionUtils';

// Rendement dynamique : la page dépend des searchParams (filtres / tri / recherche).
export const instant = false;

export async function generateStaticParams() {
  try {
    // Récupérer les collections pour générer les chemins statiques
    const collections = await getCollectionsWithCount({ first: 20, cache: 'force-cache' });
    const handles = (collections ?? []).map((collection) => collection.handle);
    return [{ handle: ALL_COLLECTION_HANDLE }, ...handles.map((handle) => ({ handle }))];
  } catch {
    // Shopify indisponible au build : on valide la route avec le catalogue.
    return [{ handle: ALL_COLLECTION_HANDLE }];
  }
}

interface CollectionPageProps {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { handle } = await params;
  const selection = parseCollectionSelection(await searchParams);

  // Récupérer toutes les collections pour les filtres (excluant lookbook)
  const allCollections = await getCollectionsWithCount({ first: 50 });

  let collection: CollectionDetailData;

  if (handle === ALL_COLLECTION_HANDLE) {
    const products = await getProducts({ first: 60 });
    collection = {
      id: ALL_COLLECTION_HANDLE,
      handle: ALL_COLLECTION_HANDLE,
      title: ALL_COLLECTION_TITLE,
      descriptionHtml: null,
      imageUrl: '',
      imageAlt: ALL_COLLECTION_TITLE,
      products,
    };
  } else {
    const found = await getCollectionProducts(handle, { first: 60 });
    if (!found) {
      notFound();
    }
    collection = found;
  }

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