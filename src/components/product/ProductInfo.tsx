/** @file
 * OXBride Atelier — Informations produit (colonne droite, sticky).
 * Titre serif, prix, sélecteur de variantes, bouton panier / sur devis,
 * puis accordéons d'informations.
 */

'use client';

import React, { useCallback, useState } from 'react';
import { Check, ShoppingBag, Truck, Heart, AlertCircle } from 'lucide-react';
import type { ProductDetailData, ProductVariantData } from '@/types/shopify';
import VariantSelector from './VariantSelector';
import { useCart } from '@/components/cart/CartProvider';
import { useWishlist } from '@/components/wishlist/WishlistProvider';

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
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const { addItem } = useCart();
  const { toggle, has } = useWishlist();

  const variant = selectedVariant;
  const priceRange = product.priceRange;
  const amount = variant?.price ?? priceRange?.min ?? '0';
  const currency = variant?.currencyCode ?? priceRange?.currency ?? 'EUR';
  const available = variant?.availableForSale ?? false;
  const canAdd = Boolean(priceRange) && available;

  const wishlisted = has(product.handle);

  const handleToggleWishlist = useCallback(() => {
    toggle({
      handle: product.handle,
      title: product.title,
      price: formatPrice(amount, currency),
      imageUrl: product.featuredImage?.url ?? '',
      imageAlt: product.featuredImage?.altText ?? product.title,
      link: product.link,
    });
  }, [toggle, product.handle, product.title, product.link, product.featuredImage, amount, currency]);

  const handleRequestQuote = useCallback(async () => {
    if (!variant) return;
    setQuoteError(null);
    setIsSubmittingQuote(true);

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'produit',
          produitHandle: product.handle,
          titre: product.title,
          variante: variant.title,
          nom: '', // Optionnel : on pourrait ouvrir une modale pour demander le nom/email
          email: '',
          telephone: '',
          message: `Demande de devis pour "${product.title}" (variante : ${variant.title}).`,
          referrer: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.errors?.[0] || 'Erreur lors de l\'envoi. Veuillez réessayer.');
      }

      setDemande(true);
      setTimeout(() => setDemande(false), 3000);
    } catch (err) {
      setQuoteError(err instanceof Error ? err.message : 'Une erreur est survenue.');
      setTimeout(() => setQuoteError(null), 5000);
    } finally {
      setIsSubmittingQuote(false);
    }
  }, [variant, product.handle, product.title, product.featuredImage]);

  const handleAddToCart = useCallback(() => {
    if (canAdd && variant) {
      addItem({
        id: variant.id,
        handle: product.handle,
        title: product.title,
        variantTitle: variant.title,
        price: Number(amount),
        currencyCode: currency,
        imageUrl: product.featuredImage?.url ?? '',
        quantity: 1,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    } else {
      handleRequestQuote();
    }
  }, [canAdd, variant, addItem, product.handle, product.title, product.featuredImage, amount, currency, handleRequestQuote]);

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

      <div className="flex items-stretch gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label={canAdd ? 'Ajouter au panier' : 'Demander un devis'}
          disabled={isSubmittingQuote}
          className="flex-1 py-5 px-8 rounded-none border border-stone-900 bg-stone-900 text-white uppercase tracking-[0.2em] text-sm font-sans font-medium transition-all duration-300 hover:bg-stone-800 hover:border-stone-800 active:scale-[0.98] flex items-center justify-center gap-3 disabled:cursor-not-allowed disabled:opacity-60"
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
          ) : isSubmittingQuote ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Envoi…</span>
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5" />
              <span>{canAdd ? 'AJOUTER AU PANIER' : 'SUR DEVIS'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={wishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={wishlisted}
          className={[
            'flex h-auto w-16 items-center justify-center rounded-none border transition-colors',
            wishlisted
              ? 'border-amber-700 bg-amber-50 text-amber-700'
              : 'border-stone-300 bg-transparent text-stone-500 hover:border-stone-900 hover:text-stone-900',
          ].join(' ')}
        >
          <Heart
            className="h-5 w-5"
            aria-hidden="true"
            fill={wishlisted ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {!canAdd && (
        <>
          {quoteError && (
            <div
              className="flex items-center gap-2 rounded-xl border border-amber-700/30 bg-amber-50/50 p-3 text-xs text-amber-700"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{quoteError}</span>
            </div>
          )}
          {!quoteError && !demande && !isSubmittingQuote && (
            <p className="text-[11px] text-stone-400 uppercase tracking-wider font-sans leading-relaxed">
              Cette pièce est confectionnée sur demande. Notre équipe vous
              contactera sous 48 heures pour un devis personnalisé ou une
              réservation en salon privé.
            </p>
          )}
        </>
      )}
    </div>
  );
}