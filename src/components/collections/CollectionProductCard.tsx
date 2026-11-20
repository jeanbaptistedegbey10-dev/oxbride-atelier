/** @file
 * OXBride Atelier — Carte produit de collection (Neo-Luxe).
 * Bordure délicate, ombre douce, zoom au survol et galerie d'images
 * interactive (flèches + points) lorsque le produit a plusieurs visuels.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { LookbookProductData } from '@/types/shopify';

interface CollectionProductCardProps {
  piece: LookbookProductData;
  /** Index du produit (priorité de chargement de la 1re image). */
  priority?: boolean;
}

export default function CollectionProductCard({
  piece,
  priority = false,
}: CollectionProductCardProps) {
  const gallery =
    piece.images.length > 0
      ? piece.images
      : [{ url: piece.imageUrl, altText: piece.imageAlt }];

  const [index, setIndex] = useState(0);
  const safeIndex = index < gallery.length ? index : 0;
  const current = gallery[safeIndex];
  const hasMultiple = gallery.length > 1;

  const step = useCallback(
    (direction: 1 | -1) => {
      setIndex((prev) => (prev + direction + gallery.length) % gallery.length);
    },
    [gallery.length]
  );

  return (
    <article className="group">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-stone-200/60 bg-stone-100/40 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
        <Image
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={90}
          priority={priority}
          className="pointer-events-none object-cover object-center w-full h-full transition-transform duration-700 group-hover:scale-105"
          src={current.url}
          alt={current.altText}
        />

        {/* Lien couvrant toute la carte (clavier + clic). */}
        <Link
          href={piece.link}
          aria-label={piece.title}
          className="absolute inset-0 z-10"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                step(-1);
              }}
              aria-label="Image précédente"
              className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-stone-900 opacity-0 backdrop-blur-sm transition-opacity duration-300 hover:bg-stone-900 hover:text-white group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                step(1);
              }}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-stone-900 opacity-0 backdrop-blur-sm transition-opacity duration-300 hover:bg-stone-900 hover:text-white group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-stone-900/35 px-3 py-1.5 backdrop-blur-sm">
              {gallery.map((image, dotIndex) => (
                <button
                  key={`${image.url}-${dotIndex}`}
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setIndex(dotIndex);
                  }}
                  aria-label={`Afficher l'image ${dotIndex + 1}`}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    safeIndex === dotIndex
                      ? 'scale-125 bg-white'
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-4">
        <h3 className="font-serif font-medium text-stone-900 text-sm sm:text-base leading-snug line-clamp-2">
          <Link
            href={piece.link}
            className="hover:text-amber-700 transition-colors"
          >
            {piece.title}
          </Link>
        </h3>
        <p className="mt-1 text-stone-500 text-xs font-sans tracking-widest uppercase leading-none">
          {piece.price}
        </p>
      </div>
    </article>
  );
}