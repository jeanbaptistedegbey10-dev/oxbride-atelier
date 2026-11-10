/** @file
 * OXBride Atelier — Galerie produit Neo-Luxe.
 * Image principale fixe et bien dimensionnée avec miniatures horizontales
 * en dessous. Clic sur une miniature pour changer le visuel principal.
 * Aucune empilement vertical : la galerie reste confinée dans son espace.
 * Animations Framer Motion.
 */

'use client';

import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductDetailData, ProductImageData } from '@/types/shopify';

interface ProductGalleryProps {
  product: ProductDetailData;
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images: ProductImageData[] =
    product.images.length > 0
      ? product.images
      : product.featuredImage
        ? [product.featuredImage]
        : [];

  const currentImage = images[currentIndex] ?? {
    url: '',
    altText: product.title,
  };

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Aucun visuel disponible : emplacement vide élégant.
  if (images.length === 0) {
    return (
      <section className="w-full space-y-6">
        <div className="w-full aspect-[3/4] lg:aspect-[4/5] rounded-3xl bg-stone-200/40 border border-stone-200/60 flex items-center justify-center">
          <span className="text-stone-400 font-sans text-xs tracking-widest uppercase">
            Visuel indisponible
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full space-y-4">
      {/* ========================================================================
          Image principale haute résolution — fixe, bien dimensionnée
          ======================================================================== */}
      <div className="relative w-full aspect-[3/4] lg:aspect-[4/5] rounded-3xl overflow-hidden border border-stone-200 bg-stone-100/40 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        <motion.div
          initial={false}
          animate={imageVariants.show}
          exit={imageVariants.exit}
          className="absolute inset-0"
          key={currentIndex}
        >
          <Image
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 35vw"
            quality={95}
            priority={currentIndex === 0}
            className="object-cover object-center w-full h-full"
            src={currentImage.url}
            alt={currentImage.altText}
          />
        </motion.div>

        {/* Navigation précédente / suivante */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goTo((currentIndex - 1 + images.length) % images.length);
              }}
              aria-label="Visuel précédent"
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-none border border-white/60 bg-white/70 text-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-300 flex items-center justify-center active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                goTo((currentIndex + 1) % images.length);
              }}
              aria-label="Visuel suivant"
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-none border border-white/60 bg-white/70 text-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-300 flex items-center justify-center active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <span className="absolute bottom-6 left-6 z-30 text-[10px] uppercase tracking-widest text-stone-400 font-sans">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* ========================================================================
          Miniatures horizontales — clic pour changer le visuel principal
          ======================================================================== */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4">
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Visuel ${index + 1}`}
              className={`shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-xl border object-cover object-center relative overflow-hidden transition-all duration-300 ${
                currentIndex === index
                  ? 'border-stone-900 ring-2 ring-offset-2 ring-stone-900 bg-stone-100 shadow-sm'
                  : 'border-stone-300/50 bg-stone-100/40 hover:border-stone-500/40'
              }`}
            >
              <Image
                fill
                quality={85}
                className="object-cover object-center rounded-xl"
                src={image.url}
                alt={image.altText}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
