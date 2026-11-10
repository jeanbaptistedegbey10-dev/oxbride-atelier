/** @file
 * OXBride Atelier — Carte de produit recommandé (Neo-Luxe).
 * Image avec zoom au survol, titre serif, prix discret.
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { LookbookProductData } from '@/types/shopify';

interface RecommendationCardProps {
  piece: LookbookProductData;
}

export default function RecommendationCard({ piece }: RecommendationCardProps) {
  return (
    <Link href={piece.link} className="block">
      <motion.div
        whileHover={{ y: -6 }}
        className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-stone-200/60 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
      >
        <div className="relative w-full h-full overflow-hidden">
          <Image
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            quality={90}
            className="object-cover object-center w-full h-full transition-transform duration-700 group-hover:scale-105"
            src={piece.imageUrl}
            alt={piece.imageAlt}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end px-6 pb-6">
          <span className="text-[10px] uppercase tracking-widest text-white font-sans font-medium">
            Voir la pièce
          </span>
        </div>
      </motion.div>
      <h3 className="mt-4 font-serif font-medium text-stone-900 text-sm sm:text-base leading-snug line-clamp-2">
        {piece.title}
      </h3>
      <p className="text-stone-500 text-xs font-sans tracking-widest uppercase leading-none">
        {piece.price}
      </p>
    </Link>
  );
}