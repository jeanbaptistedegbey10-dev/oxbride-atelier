/** @file
 * OXBride Atelier — Page de détail produit (Neo-Luxe).
 * Route : /products/[handle]
 *
 * - Récupère le produit par son handle via la Storefront API Shopify.
 * - Mise en page haute couture : galerie (~7 colonnes) à gauche, informations
 *   produit sticky (~5 colonnes) à droite.
 * - Accordéons d'informations et grille de produits similaires en bas de page.
 * - Composant serveur : rendu initial sans erreur d'hydratation Next.js.
 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  getProductByHandle,
  getRecommendedProducts,
  getProducts,
} from '@/lib/shopify/queries';
import type { LookbookProductData, ProductDetailData } from '@/types/shopify';
import ProductGallery from '@/components/product/ProductGallery';
import ProductHero from '@/components/product/ProductHero';
import ProductInfo from '@/components/product/ProductInfo';
import ProductAccordion from '@/components/product/ProductAccordion';
import ProductRecommendations from '@/components/product/ProductRecommendations';

// Rendement bloquant : autorise la lecture de données non mises en cache
// (Storefront API) lors du pré-rendu de build.
export const instant = false;

export async function generateStaticParams() {
  try {
    // Valide le pré-rendu avec un vrai produit de la boutique lorsque celle-ci
    // est joignable au moment du build.
    const products = await getProducts({ first: 1, cache: 'force-cache' });
    if (products.length > 0) {
      return [{ handle: products[0].handle }];
    }
  } catch {
    // Shopify indisponible au build : on valide la route avec un handle
    // fantôme qui affichera l'état vide élégant (jamais de plantage).
  }
  return [{ handle: 'exemple' }];
}

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

async function loadProductData(handle: string): Promise<{
  product: ProductDetailData | null;
  recommendations: LookbookProductData[];
}> {
  let product: ProductDetailData | null = null;
  let recommendations: LookbookProductData[] = [];

  try {
    product = await getProductByHandle(handle);
  } catch {
    product = null;
  }

  if (product) {
    try {
      recommendations = await getRecommendedProducts({
        excludeHandle: handle,
        first: 4,
      });
    } catch {
      recommendations = [];
    }
  }

  return { product, recommendations };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { handle } = await params;
  const { product, recommendations } = await loadProductData(handle);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#F9F8F6] text-stone-900">
        <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-stone-900 leading-[1] mb-4">
              Pièce introuvable
            </h1>
            <p className="text-lg text-stone-600 max-w-xl mx-auto">
              Cette création n'est plus disponible ou n'a pas été trouvée dans
              nos archives.
            </p>
            <div className="mt-12">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-stone-900 hover:text-amber-700 transition-colors font-sans text-sm tracking-widest uppercase"
              >
                Retour à l’accueil <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9F8F6] text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========================================================================
            Bannière d'en-tête — Bienvenue avant la découverte du produit
            ======================================================================== */}
        <ProductHero product={product} />

        {/* ========================================================================
            Mise en page haute couture : galerie ~7 colonnes | infos ~5 colonnes
            ======================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-x-12 gap-y-16 items-start">
          <div className="lg:col-span-7">
            <ProductGallery product={product} />
          </div>
          <div className="lg:col-span-5 lg:sticky lg:top-20">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* ========================================================================
            Accordéons d'informations (en dessous de la fiche)
            ======================================================================== */}
        <ProductAccordion descriptionHtml={product.descriptionHtml} />

        {/* ========================================================================
            Produits similaires en bas de page
            ======================================================================== */}
        <ProductRecommendations recommendations={recommendations} />
      </div>
    </main>
  );
}