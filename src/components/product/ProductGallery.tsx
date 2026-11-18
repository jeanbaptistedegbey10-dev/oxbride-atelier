/** @file
 * OXBride Atelier — Galerie produit Neo-Luxe.
 * Image principale avec hauteur maîtrisée (max-h-[600px]) et centrée.
 * Miniatures à gauche en colonne verticale sur desktop,
 * en ligne horizontale défilable en dessous sur mobile.
 * Clic sur une miniature pour changer le visuel principal.
 * Animations Framer Motion.
 */

'use client';

import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
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
  const thumbsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [thumbHeight, setThumbHeight] = useState<number | null>(null);

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

  // Défilement vertical programmatique et fluide de la colonne des miniatures.
  const scrollThumbs = useCallback((direction: 'up' | 'down') => {
    const delta = direction === 'up' ? -120 : 120;
    thumbsRef.current?.scrollBy({ top: delta, behavior: 'smooth' });
  }, []);

  // Synchronise la hauteur de la colonne des miniatures à celle de l'image
  // principale (desktop uniquement via la variable CSS --thumb-height).
  useEffect(() => {
    const el = imageRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const update = () => {
      const { height } = el.getBoundingClientRect();
      if (height > 0) setThumbHeight(height);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener('resize', update);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  // Aucun visuel disponible : emplacement vide élégant.
  if (images.length === 0) {
    return (
      <section className="w-full space-y-6">
        <div className="w-full max-w-[600px] aspect-[3/4] lg:aspect-[4/5] max-h-[600px] rounded-3xl bg-stone-200/40 border border-stone-200/60 flex items-center justify-center mx-auto">
          <span className="text-stone-400 font-sans text-xs tracking-widest uppercase">
            Visuel indisponible
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      {/* ========================================================================
          Galerie : image principale + miniatures
          Mobile   : image au-dessus, miniatures en ligne horizontale en dessous
          Desktop  : miniatures à gauche (colonne), image principale à droite
          ======================================================================== */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start w-full">

        {/* ========================================================================
            Image principale — hauteur maîtrisée, centrée
            ======================================================================== */}
        <div ref={imageRef} className="order-1 lg:order-2 flex-1 relative w-full aspect-[3/4] lg:aspect-[4/5] max-h-[600px] rounded-3xl overflow-hidden border border-stone-200 bg-stone-100/40 shadow-[0_20px_60px_rgba(0,0,0,0.06)] mx-auto lg:mx-0">
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
            Miniatures — colonne verticale sur desktop, hauteur strictement
            synchronisée à l'image principale (flex column : flèche haut, zone de
            défilement flex-1, flèche bas — sans aucun chevauchement).
            Ligne horizontale défilable en dessous sur mobile.
            ======================================================================== */}
        {images.length > 1 && (
          <div
            style={
              thumbHeight != null
                ? ({ '--thumb-height': `${thumbHeight}px` } as React.CSSProperties)
                : undefined
            }
            className="order-2 lg:order-1 w-full lg:w-[90px] lg:flex lg:flex-col lg:h-[var(--thumb-height,600px)]"
          >
            {/* Flèche de défilement vers le haut (desktop) */}
            <button
              type="button"
              onClick={() => scrollThumbs('up')}
              aria-label="Faire défiler les miniatures vers le haut"
              className="hidden lg:flex w-full h-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors duration-300"
            >
              <ChevronUp className="h-5 w-5" />
            </button>

            <div
              ref={thumbsRef}
              className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 -mx-4 lg:mx-0 lg:flex-1 lg:min-h-0 lg:overflow-x-hidden lg:overflow-y-auto lg:pb-0 lg:pr-1 items-center lg:items-start custom-scrollbar"
            >
              {images.map((image, index) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Visuel ${index + 1}`}
                  className={`shrink-0 ${
                    currentIndex === index
                      ? 'w-16 h-16 lg:w-20 lg:h-20 border-stone-900 ring-2 ring-offset-2 ring-stone-900 bg-stone-100 shadow-sm'
                      : 'w-16 h-16 lg:w-20 lg:h-20 border-stone-300/50 bg-stone-100/40 hover:border-stone-500/40'
                  } rounded-xl relative overflow-hidden transition-all duration-300`}
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

            {/* Flèche de défilement vers le bas (desktop) */}
            <button
              type="button"
              onClick={() => scrollThumbs('down')}
              aria-label="Faire défiler les miniatures vers le bas"
              className="hidden lg:flex w-full h-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-stone-800 hover:bg-stone-200 transition-colors duration-300"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
