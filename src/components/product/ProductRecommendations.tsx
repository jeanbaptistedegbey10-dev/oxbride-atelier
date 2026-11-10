/** @file
 * OXBride Atelier — Section produits similaires (Neo-Luxe).
 * Grille de 4 cartes recommandées avec ombres douces et zoom au survol.
 */

'use client';

import React from 'react';
import type { LookbookProductData } from '@/types/shopify';
import RecommendationCard from './RecommendationCard';

interface ProductRecommendationsProps {
  recommendations: LookbookProductData[];
}

export default function ProductRecommendations({
  recommendations,
}: ProductRecommendationsProps) {
  if (recommendations.length === 0) return null;

  return (
    <section className="mt-16 lg:mt-24">
      <div className="text-center mb-12">
        <span className="block text-[10px] uppercase tracking-widest text-amber-700/90 font-sans font-medium mb-3">
          Poursuivre l’exploration
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold leading-[1] tracking-tight text-stone-900">
          Vous aimerez peut-être
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {recommendations.map((piece) => (
          <RecommendationCard key={piece.handle} piece={piece} />
        ))}
      </div>
    </section>
  );
}