/** @file
 * OXBride Atelier — Bannière d'en-tête de fiche produit (Neo-Luxe).
 * Bandeau aérien affichant exclusivement le fil d'Ariane stylisé.
 */

import Link from 'next/link';
import type { ProductDetailData } from '@/types/shopify';

interface ProductHeroProps {
  product: ProductDetailData;
}

export default function ProductHero({ product }: ProductHeroProps) {
  return (
    <section className="bg-[#F9F8F6] border-b border-stone-200/70 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16">
          <nav className="flex items-center gap-1 text-xs font-sans uppercase tracking-widest text-stone-500">
            <Link href="/" className="hover:text-stone-900 transition-colors">
              Accueil
            </Link>
            <span className="mx-1 text-stone-300">/</span>
            <Link href="/collections" className="hover:text-stone-900 transition-colors">
              Collections
            </Link>
            <span className="mx-1 text-stone-300">/</span>
            <span className="text-stone-500">{product.title}</span>
          </nav>
        </div>
      </div>
    </section>
  );
}
