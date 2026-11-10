/**
 * OXBride Atelier — Section : Les Collections (Univers de la Maison)
 *
 * - Grille épurée des collections récupérées exclusivement depuis la Storefront API Shopify.
 * - Requête GraphQL avec `first: 13` pour garantir 12 cartes après exclusion du Lookbook.
 * - La collection "Lookbook" (handle ou titre) est totalement exclue de l'affichage.
 * - Tri personnalisé appliqué selon l'ordre de numérotation client (12 collections).
 * - Chaque carte lie directement son titre, son lien et son image aux données réelles de Shopify.
 * - Quand une collection ne renvoie aucune image, le rendu reste propre sans fausse donnée.
 * - Carte verticale haute couture : image, titre serif unique, lien vers la collection.
 * - Zoom subtil au survol, fond #FCFBF9, espacement généreux.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";
import { getCollections } from "@/lib/shopify/queries";
import type { CollectionData } from "@/types/shopify";

interface CollectionsGridProps {
  className?: string;
}

/**
 * Ordre personnalisé des collections (positions 1-12) basé sur les titres Shopify.
 * La position 8 est réservée à la collection de remplacement du Lookbook.
 * Les collections non listées ici se voient attribuer la position 8.
 */
const COLLECTION_SORT_ORDER: Record<string, number> = {
  'Robes de Mariée - Classique Royale': 1,
  'Robes de Mariée - Édition Contemporaine': 2,
  'Robes de Mariée - Silhouette Sirène & Dentelle': 3,
  'Alliances - L\'Éclat de l\'Engagement': 4,
  'Couple - Élégance Intemporelle': 5,
  'Ensembles Couple - Harmonie Minis': 6,
  'Ensembles Couple - Prestige Afro-Américain': 7,
  'Costumes Hommes - Smoking d\'Exception': 9,
  'Cortège - Le Marié & ses Demoiselles d\'Honneur': 10,
  'Costumes Hommes - Tailoring Moderne': 11,
  'Joaillerie - Couronnes & Diadèmes Royaux': 12,
};

/**
 * Normalise une chaîne pour comparaison (supprime accents, met en minuscule, trim).
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Détermine si une collection est le Lookbook à exclure (par handle ou titre).
 */
function isLookbookCollection(collection: CollectionData): boolean {
  const handle = normalize(collection.handle);
  const title = normalize(collection.title);
  return handle === 'lookbook' || title.includes('lookbook');
}

/**
 * Calcule la position de tri d'une collection.
 * Les collections listées dans COLLECTION_SORT_ORDER conservent leur position.
 * Toute autre collection (hors Lookbook) se voit attribuer la position 8
 * (emplacement de remplacement du Lookbook).
 */
function getSortPosition(collection: CollectionData): number {
  const normalizedTitle = normalize(collection.title);
  for (const [title, position] of Object.entries(COLLECTION_SORT_ORDER)) {
    if (normalize(title) === normalizedTitle) {
      return position;
    }
  }
  return 8;
}

export default function CollectionsGrid({ className }: CollectionsGridProps) {
  const [data, setData] = React.useState<CollectionData[] | null>(null);

  React.useEffect(() => {
    let mounted = true;
    // On récupère 13 collections pour garantir 12 cartes après exclusion du Lookbook.
    getCollections({ first: 13, cache: "no-store" }).then((result) => {
      if (mounted) {
        if (result) {
          // 1. Exclure totalement la collection "Lookbook"
          const filtered = result.filter((c) => !isLookbookCollection(c));
          // 2. Appliquer le tri personnalisé par ordre de numérotation
          filtered.sort((a, b) => getSortPosition(a) - getSortPosition(b));
          // 3. Garantir exactement 12 cartes dans la grille
          setData(filtered.slice(0, 12));
        } else {
          setData(null);
        }
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const collections = data ?? [];

  const animate = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: "easeOut" } as const,
  };

  return (
    <section
      className={`relative bg-[#FCFBF9] text-stone-900 overflow-x-hidden ${className ?? ""}`}
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
          {collections.map((collection) => (
            <Link key={collection.handle} href={collection.link} className="block">
              <div className="relative group overflow-hidden rounded-[2rem] border border-stone-100/60 bg-[#FCFBF9] shadow-sm">
                <div className="relative w-full aspect-[4/5] bg-stone-50/40">
                  {collection.imageUrl && collection.imageUrl.trim() !== "" ? (
                    <Image
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 25vw"
                      quality={95}
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      alt={collection.imageAlt}
                      src={collection.imageUrl}
                    />
                  ) : null}
                </div>

                <div className="p-6 sm:p-8 pt-4">
                  <h3 className="text-sm sm:text-base font-serif font-bold text-stone-900 leading-tight">
                    {collection.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}