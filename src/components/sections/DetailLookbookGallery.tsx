/**
 * OXBride Atelier — Section 5 : La Noblesse des Matières (Lookbook Galerie)
 *
 * Récupère exclusivement les vrais produits de la collection "lookbook"
 * (handle exact) depuis la Storefront API Shopify. Aucune donnée statique
 * ni fictive : si le shop est indisponible ou ne renvoie aucun produit,
 * la grille reste vide.
 *
 * Esthétique néo-luxe : fond #F9F8F6, espacement aéré, grille de cartes
 * produits, images avec zoom au survol, titres serif et prix discrets.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getLookbookProducts } from '@/lib/shopify/queries';
import type { LookbookProductData } from '@/types/shopify';

interface DetailLookbookGalleryProps {
  className?: string;
}

/**
 * Carte produit individuelle avec galerie d'images interactive.
 * Gère son propre état `currentImageIndex` pour le carrousel.
 */
function ProductCard({ piece }: { piece: LookbookProductData }) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const imageCount = piece.images.length;
  const hasMultipleImages = imageCount > 1;

  const currentImage =
    piece.images[currentImageIndex] ?? {
      url: piece.imageUrl,
      altText: piece.imageAlt,
    };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageCount);
  };

  const goToPrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
  };

  return (
    <Link href={piece.link} className="block">
      <div className="relative group rounded-2xl overflow-hidden">
        <div className="relative w-full aspect-[3/4]">
          <Image
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            quality={95}
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
            alt={currentImage.altText}
            src={currentImage.url}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />
          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  goToPrev();
                }}
                aria-label="Image précédente"
                className="absolute left-4 top-1/2 -translate-y-1/2"
              >
                <span className="inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
                  <span className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm rounded-full transition-all duration-300 group-hover:bg-stone-900/40" />
                  <span className="relative z-10 text-stone-200 text-lg font-serif font-bold leading-none">
                    &lt;
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  goToNext();
                }}
                aria-label="Image suivante"
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <span className="inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
                  <span className="absolute inset-0 bg-stone-900/20 backdrop-blur-sm rounded-full transition-all duration-300 group-hover:bg-stone-900/40" />
                  <span className="relative z-10 text-stone-200 text-lg font-serif font-bold leading-none">
                    &gt;
                  </span>
                </span>
              </button>
            </>
          )}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {Array.from({ length: imageCount }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentImageIndex(idx)}
                  aria-label={`Image ${idx + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    currentImageIndex === idx
                      ? 'bg-stone-900'
                      : 'bg-stone-500/30 hover:bg-stone-500/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="p-6 pt-10">
          <h3 className="font-serif font-medium text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 overflow-hidden text-ellipsis h-[2.8em] mb-2">
            {piece.title}
          </h3>
          <p className="text-stone-500 text-xs font-sans tracking-widest uppercase leading-none">
            {piece.price}
          </p>
        </div>
      </div>
    </Link>
  );
}

/**
 * Récupère les vrais produits de la collection "lookbook" (Storefront API).
 * Aucune donnée statique ni fictive : si le shop est indisponible ou vide,
 * la grille reste vide.
 */
export default function DetailLookbookGallery({ className }: DetailLookbookGalleryProps) {
  const [pieces, setPieces] = React.useState<LookbookProductData[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    getLookbookProducts({ handle: 'lookbook', first: 12, cache: 'no-store' }).then(
      (products) => {
        if (mounted) {
          setPieces(products);
          setIsLoaded(true);
        }
      }
    );
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      className={`relative bg-[#F9F8F6] text-stone-900 overflow-x-hidden ${className ?? ''}`}
      aria-labelledby="lookbook-title"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center lg:text-left max-w-3xl lg:max-w-full mb-10 lg:mb-16">
          <span className="block text-[10px] lg:text-xs uppercase tracking-widest text-amber-700/90 font-cinzel font-medium leading-none mb-3">
            L’Art du Détail
          </span>
          <h2 id="lookbook-title" className="text-4xl lg:text-6xl font-serif font-bold leading-[1] tracking-tight mb-4">
            La Noblesse des Matières
          </h2>
          <p className="text-lg lg:text-xl text-stone-700 leading-relaxed max-w-xl">
            Soie, dentelle de Chantilly, broderies main : chaque matière raconte
            l’exigence d’un geste couture. Découvrez les pièces sélectionnées de
            notre lookbook.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pieces.map((piece) => (
            <ProductCard key={piece.handle} piece={piece} />
          ))}
        </div>
      </div>
    </section>
  );
}