/** @file
 * OXBride Atelier — Informations produit (colonne droite, sticky).
 * Titre serif, prix, sélecteur de variantes, bouton panier / sur devis,
 * puis accordéons d'informations.
 */

'use client';

import { motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { Check, ShoppingBag, Truck } from 'lucide-react';
import Link from 'next/link';
import type { ProductDetailData, ProductVariantData } from '@/types/shopify';
import VariantSelector from './VariantSelector';
import ProductAccordion from './ProductAccordion';

interface ProductInfoProps {
  product: ProductDetailData;
}

const formatPrice = (amount: string, currency = 'EUR'): string =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(Number(amount) / 100);

export default function ProductInfo({ product }: ProductInfoProps) {
  const defaultVariant = product.variants[0] ?? null;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariantData | null>(
    defaultVariant
  );
  const [added, setAdded] = useState(false);
  const [demande, setDemande] = useState(false);

  const variant = selectedVariant;
  const priceRange = product.priceRange;
  const amount = variant?.price ?? priceRange?.min ?? '0';
  const currency = variant?.currencyCode ?? priceRange?.currency ?? 'EUR';
  const available = variant?.availableForSale ?? false;
  const canAdd = Boolean(priceRange) && available;

  const handleAddToCart = useCallback(() => {
    if (canAdd) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    } else {
      setDemande(true);
      setTimeout(() => setDemande(false), 2200);
    }
  }, [canAdd]);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <span className="block text-[10px] uppercase tracking-widest text-amber-700/90 font-sans font-medium">
          Pièce de l’Atelier
        </span>
        <h1 className="font-serif text-2xl md:text-3xl text-stone-900 leading-[1] tracking-tight">
          {product.title}
        </h1>
        <p className="text-stone-700 text-lg tracking-wider">
          {formatPrice(amount, currency)}
        </p>
        {!canAdd && (
          <p className="text-xs text-stone-500 uppercase tracking-widest font-sans">
            Pièce sur demande — disponibilité à confirmer
          </p>
        )}
      </div>

      {product.variants.length > 0 && (
        <VariantSelector variants={product.variants} onChange={setSelectedVariant} />
      )}

      <button
        type="button"
        onClick={handleAddToCart}
        aria-label={canAdd ? 'Ajouter au panier' : 'Demander un devis'}
        className="w-full py-5 px-8 rounded-none border border-stone-900 bg-stone-900 text-white uppercase tracking-[0.2em] text-sm font-sans font-medium transition-all duration-300 hover:bg-stone-800 hover:border-stone-800 active:scale-[0.98] flex items-center justify-center gap-3"
      >
        {added ? (
          <>
            <Check className="h-5 w-5" />
            <span>Ajouté au panier</span>
          </>
        ) : demande ? (
          <>
            <Truck className="h-5 w-5" />
            <span>Demande de devis envoyée</span>
          </>
        ) : (
          <>
            <ShoppingBag className="h-5 w-5" />
            <span>{canAdd ? 'AJOUTER AU PANIER' : 'SUR DEVIS'}</span>
          </>
        )}
      </button>

      {!canAdd && (
        <p className="text-[11px] text-stone-400 uppercase tracking-wider font-sans leading-relaxed">
          Cette pièce est confectionnée sur demande. Notre équipe vous
          contactera sous 48 heures pour un devis personnalisé ou une
          réservation en salon privé.
        </p>
      )}

      <ProductAccordion descriptionHtml={product.descriptionHtml} />
    </div>
  );
}