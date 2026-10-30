/**
 * OXBride Atelier — Section : Les Collections (Univers de la Maison)
 *
 * - Grille épurée des collections récupérées depuis la Storefront API Shopify.
 * - Requête GraphQL avec `first: 12` pour récupérer jusqu'à 12 collections.
 * - L'ordonnancement se fait impérativement sur la liste officielle des 12 `handle`
 *   Shopify (bruts, tels que renvoyés par l'API), ligne par ligne, 4 cartes par ligne
 *   sur 3 lignes. Aucun slug n'est recréé côté front-end.
 * - Carte verticale haute couture : image, titre serif unique, lien vers la collection.
 * - Zoom subtil au survol, fond #FCFBF9, espacement généreux.
 * - Fallback statique si le shop est indisponible.
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';
import { getCollections } from '@/lib/shopify/queries';
import type { CollectionData } from '@/types/shopify';

/** Image de secours haute couture / mariage (Unsplash) utilisée quand aucune URL valide n'est fournie. */
const FALLBACK_IMAGE_URL =
  'https://images.unsplash.com/photo-1519680976318-d06029ae916f?w=900&q=80&fm=jpg';

/** Fallback spécifique "Témoins" : photo d'hommes en costume (Unsplash) quand Shopify ne renvoie pas d'image pour ce handle. */
const GARCONS_DHONNEUR_FALLBACK_IMAGE_URL =
  'https://images.unsplash.com/photo-1507679799987-c73779564d5c?w=900&q=80&fm=jpg';

/** Configuration statique de repli si le shop est indisponible. */
const COLLECTIONS_FALLBACK: CollectionData[] = [
  {
    id: 'robes-de-mariee-royale',
    handle: 'robes-de-mariee-royale',
    title: 'Robes de Mariée - Classique Royale',
    subtitle: '',
    description: '',
    link: '/collections/robes-de-mariee-royale',
    imageUrl:
      'https://images.unsplash.com/photo-1518570883242-c1a526be1e76?w=900&q=80&fm=jpg',
    imageAlt: 'Robe de mariée Classique Royale — haute couture OXBride Atelier',
  },
  {
    id: 'robes-de-mariee-contemporaine',
    handle: 'robes-de-mariee-contemporaine',
    title: 'Robes de Mariée - Édition Contemporaine',
    subtitle: '',
    description: '',
    link: '/collections/robes-de-mariee-contemporaine',
    imageUrl:
      'https://images.unsplash.com/photo-1531376124629-c7deb296a43f?w=900&q=80&fm=jpg',
    imageAlt: 'Robe de mariée Édition Contemporaine — OXBride Atelier',
  },
  {
    id: 'robes-de-mariee-sirene',
    handle: 'robes-de-mariee-sirene',
    title: 'Robes de Mariée - Silhouette Sirène & Dentelle',
    subtitle: '',
    description: '',
    link: '/collections/robes-de-mariee-sirene',
    imageUrl:
      'https://images.unsplash.com/photo-1519680976318-d06029ae916f?w=900&q=80&fm=jpg',
    imageAlt: 'Robe de mariée Silhouette Sirène & Dentelle — OXBride Atelier',
  },
  {
    id: 'alliances-joaillerie',
    handle: 'alliances-joaillerie',
    title: "Alliances - L'Éclat de l'Engagement",
    subtitle: '',
    description: '',
    link: '/collections/alliances-joaillerie',
    imageUrl:
      'https://images.unsplash.com/photo-1517744140267-4851ed374963?w=900&q=80&fm=jpg',
    imageAlt: "Alliances L'Éclat de l'Engagement — OXBride Atelier",
  },
  {
    id: 'ensembles-couple-intemporel',
    handle: 'ensembles-couple-intemporel',
    title: 'Couple - Élégance Intemporelle',
    subtitle: '',
    description: '',
    link: '/collections/ensembles-couple-intemporel',
    imageUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=80&fm=jpg',
    imageAlt: 'Couple Élégance Intemporelle — OXBride Atelier',
  },
  {
    id: 'ensembles-couple-mixte',
    handle: 'ensembles-couple-mixte',
    title: 'Ensembles Couple - Harmonie Mixte',
    subtitle: '',
    description: '',
    link: '/collections/ensembles-couple-mixte',
    imageUrl:
      'https://images.unsplash.com/photo-1580485363467-ed5919b0e2e7?w=900&q=80&fm=jpg',
    imageAlt: 'Ensembles Couple Harmonie Mixte — OXBride Atelier',
  },
  {
    id: 'ensembles-couple-prestige',
    handle: 'ensembles-couple-prestige',
    title: 'Ensembles Couple - Prestige Afro-Américain',
    subtitle: '',
    description: '',
    link: '/collections/ensembles-couple-prestige',
    imageUrl:
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=900&q=80&fm=jpg',
    imageAlt: 'Ensembles Couple Prestige Afro-Américain — OXBride Atelier',
  },
  {
    id: 'costumes-tailoring-moderne',
    handle: 'costumes-tailoring-moderne',
    title: 'Costumes Hommes - Tailoring Moderne',
    subtitle: '',
    description: '',
    link: '/collections/costumes-tailoring-moderne',
    imageUrl:
      'https://images.unsplash.com/photo-1593246471373-b199d92b69cf?w=900&q=80&fm=jpg',
    imageAlt: 'Costume Homme Tailoring Moderne — OXBride Atelier',
  },
  {
    id: 'cortege-demoiselles-dhonneur',
    handle: 'cortege-demoiselles-dhonneur',
    title: "Cortège - La Mariée & ses Demoiselles d'Honneur",
    subtitle: '',
    description: '',
    link: '/collections/cortege-demoiselles-dhonneur',
    imageUrl:
      'https://images.unsplash.com/photo-1529354487289-ed975239824e?w=900&q=80&fm=jpg',
    imageAlt: "Cortège La Mariée & ses Demoiselles d'Honneur — OXBride Atelier",
  },
  {
    id: 'garcons-dhonneur',
    handle: 'garcons-dhonneur',
    title: "Témoins - Le Marié & ses Garçons d'Honneur",
    subtitle: '',
    description: '',
    link: '/collections/garcons-dhonneur',
    imageUrl:
      'https://images.unsplash.com/photo-1532968814121-080924989e00?w=900&q=80&fm=jpg',
    imageAlt: "Témoins Le Marié & ses Garçons d'Honneur — OXBride Atelier",
  },
  {
    id: 'couronnes-diademes',
    handle: 'couronnes-diademes',
    title: 'Joaillerie - Couronnes & Diadèmes Royaux',
    subtitle: '',
    description: '',
    link: '/collections/couronnes-diademes',
    imageUrl:
      'https://images.unsplash.com/photo-1615105788020-5976787b1f76?w=900&q=80&fm=jpg',
    imageAlt: 'Joaillerie Couronnes & Diadèmes Royaux — OXBride Atelier',
  },
  {
    id: 'smokings-exception',
    handle: 'smokings-exception',
    title: "Costumes Hommes - Smoking d'Exception",
    subtitle: '',
    description: '',
    link: '/collections/smokings-exception',
    imageUrl:
      'https://images.unsplash.com/photo-1603830473818-63d750874746?w=900&q=80&fm=jpg',
    imageAlt: "Costume Homme Smoking d'Exception — OXBride Atelier",
  },
];

/**
 * Construit le tableau final de collections pour la grille (max 12 cartes).
 *
 * - L'ordonnancement est impératif : les collections sont disposées selon
 *   la liste officielle des 12 `handle` Shopify, ligne par ligne, dans
 *   l'ordre exact défini par `OFFICIAL_HANDLES`.
 * - Aucun slug n'est recréé : on utilise les `handle` bruts de l'API.
 * - Les collections renvoyées par Shopify qui correspondent à un handle
 *   officiel prennent leur place officielle ; les places restantes (shop
 *   indisponible, collection manquante) sont comblées par
 *   `COLLECTIONS_FALLBACK` dans le même ordre officiel, sans doublon de handle.
 * - Le tableau d'entrée n'est pas muté.
 */
const OFFICIAL_HANDLES: readonly string[] = [
  'robes-de-mariee-royale',
  'robes-de-mariee-contemporaine',
  'robes-de-mariee-sirene',
  'alliances-joaillerie',
  'ensembles-couple-intemporel',
  'ensembles-couple-mixte',
  'ensembles-couple-prestige',
  'costumes-tailoring-moderne',
  'cortege-demoiselles-dhonneur',
  'garcons-dhonneur',
  'couronnes-diademes',
  'smokings-exception',
];

function buildOrderedCollections(shopifyCollections: CollectionData[]): CollectionData[] {
  const byHandle = new Map<string, CollectionData>();
  for (const collection of shopifyCollections) {
    if (!byHandle.has(collection.handle)) {
      byHandle.set(collection.handle, collection);
    }
  }

  const ordered: CollectionData[] = [];
  const seenHandles = new Set<string>();

  // 1. Ordre officiel ligne par ligne : on place d'abord les collections
  //    réellement renvoyées par Shopify à leur rang officiel.
  for (const handle of OFFICIAL_HANDLES) {
    if (ordered.length >= 12) break;
    const shopifyCollection = byHandle.get(handle);
    if (shopifyCollection) {
      ordered.push(shopifyCollection);
      seenHandles.add(handle);
    }
  }

  // 2. Compléter avec le fallback statique pour atteindre 12 cartes,
  //    toujours dans l'ordre officiel, sans doublon de handle.
  if (ordered.length < 12) {
    for (const fallback of COLLECTIONS_FALLBACK) {
      if (ordered.length >= 12) break;
      if (!seenHandles.has(fallback.handle)) {
        ordered.push(fallback);
        seenHandles.add(fallback.handle);
      }
    }
  }

  return ordered;
}

interface CollectionsGridProps {
  className?: string;
}

export default function CollectionsGrid({ className }: CollectionsGridProps) {
  const [data, setData] = React.useState<CollectionData[] | null>(null);
  React.useEffect(() => {
    let mounted = true;
    getCollections({ first: 12, cache: 'no-store' }).then((result) => {
      if (mounted) {
        setData(result ?? null);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const collections = buildOrderedCollections(data ?? COLLECTIONS_FALLBACK);

  const animate = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: 'easeOut' } as const,
  };

  return (
    <section
      className={`relative bg-[#FCFBF9] text-stone-900 overflow-x-hidden ${className ?? ''}`}
      aria-labelledby="collections-grid-title"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-36">
        <div className="text-center lg:text-left max-w-3xl lg:max-w-full mb-16 lg:mb-24">
          <motion.div {...animate} transition={{ ...animate.transition, delay: 0 }}>
            <span className="block text-[10px] lg:text-xs uppercase tracking-widest text-amber-700/90 font-cinzel font-medium leading-none mb-3">
              Les Univers de la Maison
            </span>
          </motion.div>
          <motion.h2 {...animate} transition={{ ...animate.transition, delay: 0.1 }} id="collections-grid-title">
            Nos Collections
          </motion.h2>
        </div>

        <motion.div
          {...animate}
          transition={{ ...animate.transition, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
        >
          {collections.map((collection) => {
            const imageUrl =
              collection.imageUrl && collection.imageUrl.trim() !== ''
                ? collection.imageUrl
                : collection.handle === 'garcons-dhonneur'
                  ? GARCONS_DHONNEUR_FALLBACK_IMAGE_URL
                  : FALLBACK_IMAGE_URL;
            return (
              <Link
                key={collection.handle}
                href={collection.link}
                className="block"
              >
                <div className="relative group overflow-hidden rounded-[2rem] border border-stone-100/60 bg-[#FCFBF9] shadow-sm">
                  <div className="relative w-full aspect-[4/5] bg-stone-50/40">
                    <Image
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 25vw"
                      quality={95}
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      alt={collection.imageAlt}
                      src={imageUrl}
                    />
                  </div>

                  <div className="p-6 sm:p-8 pt-4">
                    <h3 className="text-sm sm:text-base font-serif font-bold text-stone-900 leading-tight">
                      {collection.title}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}