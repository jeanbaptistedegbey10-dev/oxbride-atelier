/**
 * OXBride Atelier — Section 5 : L’Art du Détail (Lookbook / Galerie dynamique)
 *
 * - Galerie éditoriale asymétrique, style magazine haute couture
 * - Récupère dynamiquement les produits de la collection Shopify `lookbook`
 *   (handle `lookbook`) via la Storefront API.
 * - Mise en page CSS Grid asymétrique : formats portrait, carré et paysage mêlés
 * - Esthétique néo-luxe : images plein écran, zoom au survol, légendes serif subtiles
 * - Fallback statique élégant si le shop est indisponible.
 * - overflow-x-hidden.
 */

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import React from 'react';
import Link from 'next/link';
import { getLookbookProducts } from '@/lib/shopify/queries';
import type { LookbookProductData } from '@/types/shopify';
import { LOOKBOOK_FALLBACK } from '@/types/shopify';

interface DetailLookbookGalleryProps {
  className?: string;
}

/** Squelette élégant de la galerie, affiché tant que Shopify n'a pas répondu. */
function LookbookGallerySkeleton() {
  const pulse = {
    initial: { opacity: 0.4 },
    animate: { opacity: [0.4, 0.75, 0.4] },
    transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } as const,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <motion.div
          key={i}
          {...pulse}
          className="rounded-2xl bg-stone-100/60 backdrop-blur-sm overflow-hidden"
        >
          <div
            className={`w-full h-full ${
              i % 4 === 0 ? 'aspect-[3/4]' : i % 4 === 1 ? 'aspect-square' : i % 4 === 2 ? 'aspect-[4/3]' : 'aspect-[3/4]'
            } bg-stone-200/50`}
            aria-hidden="true"
          />
          <div className="p-4">
            <div className="h-6 w-32 bg-stone-200/60 rounded mb-2" aria-hidden="true" />
            <div className="h-4 w-24 bg-stone-200/60 rounded" aria-hidden="true" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Détermine la variante de mise en page éditoriale pour chaque pièce.
 * Alterne entre portrait (row-span-2), carré et paysage pour un rythme visuel luxueux.
 */
function getLayoutVariant(idx: number): string {
  switch (idx % 6) {
    case 0:
      return 'row-span-2 aspect-[3/4]'; // Portrait vertical, sur 2 rangées
    case 1:
      return 'aspect-square'; // Carré
    case 2:
      return 'aspect-[4/3]'; // Paysage
    case 3:
      return 'row-span-2 aspect-[3/4]'; // Portrait vertical
    case 4:
      return 'col-span-2 aspect-[4/3]'; // Paysage large, sur 2 colonnes
    case 5:
      return 'aspect-square'; // Carré
    default:
      return 'aspect-square';
  }
}

export default function DetailLookbookGallery({ className }: DetailLookbookGalleryProps) {
  const [products, setProducts] = React.useState<LookbookProductData[] | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    getLookbookProducts({ cache: 'no-store' }).then((result) => {
      if (mounted) {
        // Aucun produit (null ou tableau vide) → fallback élégant, jamais d'espace vide.
        setProducts(result && result.length > 0 ? result : null);
        setIsLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const isLoading = !isLoaded;
  const pieces = products && products.length > 0 ? products : LOOKBOOK_FALLBACK;

  const animate = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: 'easeOut' } as const,
  };

  return (
    <section
      className={`relative bg-[#FCFBF9] text-stone-900 overflow-x-hidden ${className ?? ''}`}
      aria-labelledby="lookbook-title"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-36">
        <div className="text-center lg:text-left max-w-3xl lg:max-w-full mb-16 lg:mb-24">
          <motion.div {...animate} transition={{ ...animate.transition, delay: 0 }}>
            <span className="block text-[10px] lg:text-xs uppercase tracking-widest text-amber-700/90 font-cinzel font-medium leading-none mb-3">
              L’Art du Détail
            </span>
          </motion.div>
          <motion.h2 {...animate} transition={{ ...animate.transition, delay: 0.1 }} id="lookbook-title" className="text-4xl lg:text-6xl font-serif font-bold leading-[1] tracking-tight mb-4">
            La Noblesse des Matières
          </motion.h2>
          <motion.p {...animate} transition={{ ...animate.transition, delay: 0.2 }} className="text-lg lg:text-xl text-stone-700 leading-relaxed max-w-xl">
            Soie, dentelle de Chantilly, broderies main : chaque matière raconte l’exigence d’un
            geste couture. Découvrez les pièces sélectionnées de notre lookbook.
          </motion.p>
        </div>

        {isLoading ? (
          <LookbookGallerySkeleton />
        ) : (
          <motion.div
            {...animate}
            transition={{ ...animate.transition, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {pieces.map((piece, idx) => {
              const delay = 0.35 + idx * 0.08;
              const variant = getLayoutVariant(idx);
              return (
                <motion.div
                  {...animate}
                  transition={{ ...animate.transition, delay }}
                  className={`break-inside-avoid mb-6 ${variant}`}
                  key={piece.handle}
                >
                  <Link href={piece.link} className="block">
                    <div className="relative group rounded-2xl overflow-hidden">
                      <div className="relative w-full h-full">
                        <Image
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          quality={95}
                          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          alt={piece.imageAlt}
                          src={piece.imageUrl}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 pb-8">
                          <h3 className="font-serif font-medium text-white text-lg leading-snug mb-1">
                            {piece.title}
                          </h3>
                          <p className="text-white/60 text-xs font-sans tracking-widest uppercase">
                            {piece.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}