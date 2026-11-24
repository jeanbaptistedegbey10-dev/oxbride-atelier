/**
 * OXBride Atelier — Tiroir panier (slide-over) de luxe.
 *
 * - Panneau latéral droit, fond champagne poudré `#F9F8F6`, bordure fine.
 * - Liste des lignes avec image, titre, variante, quantité (+/-) et suppression.
 * - Sous-total calculé, bouton « Passer commande » → crée un panier Shopify
 *   Storefront API (cartCreate) et redirige vers le `checkoutUrl`.
 *   États : chargement, erreur (mode démo, variante sans ID, boutique protégée),
 *   succès (redirection).
 * - Fermeture par bouton, clic sur l'overlay ou touche Échap.
 *
 * Toutes les icônes SVG ont une taille explicite (`w-4 h-4` / `w-5 h-5`).
 */

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { useCart } from './CartProvider';

const formatPrice = (amount: number, currency = 'EUR'): string =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount / 100);

export default function CartDrawer() {
  const {
    lines,
    subtotal,
    currencyCode,
    count,
    isDrawerOpen,
    closeDrawer,
    increment,
    decrement,
    remove,
    createCheckout,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Fermeture au clavier (Échap) tant que le tiroir est ouvert.
  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  const handleCheckout = async () => {
    if (lines.length === 0 || isCheckingOut) return;

    setIsCheckingOut(true);
    setCheckoutError(null);
    setIsDemoMode(false);

    const result = await createCheckout();

    if (result.success && result.checkoutUrl) {
      // Redirection vers le checkout Shopify
      window.location.href = result.checkoutUrl;
      return;
    }

    // Échec : mode démo ou erreur
    setIsCheckingOut(false);
    setCheckoutError(result.error ?? 'Erreur lors de la création du panier.');
    setIsDemoMode(result.demoMode ?? false);
  };

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Panier">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fermer le panier"
        onClick={closeDrawer}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
        disabled={isCheckingOut}
      />

      {/* Panneau latéral */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#F9F8F6] shadow-2xl flex flex-col">
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200/80">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Votre panier{count > 0 ? ` (${count})` : ''}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Fermer"
            disabled={isCheckingOut}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white/60 text-stone-700 hover:border-stone-900 hover:text-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Corps */}
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="w-10 h-10 text-stone-300" aria-hidden="true" />
            <p className="font-serif text-lg text-stone-700">Votre panier est vide</p>
            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
              Chaque pièce est une œuvre unique. Découvrez nos collections et
              trouvez celle qui révélera votre histoire.
            </p>
            <button
              type="button"
              onClick={closeDrawer}
              className="mt-2 inline-flex items-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-3 px-6 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors"
            >
              Continuer la découverte
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-5">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-stone-200/60 bg-stone-100">
                    {line.imageUrl ? (
                      <Image
                        src={line.imageUrl}
                        alt={line.title}
                        fill
                        sizes="80px"
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-stone-300" aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-serif text-sm font-medium text-stone-900 leading-snug line-clamp-2">
                          {line.title}
                        </p>
                        {line.variantTitle && (
                          <p className="text-xs text-stone-500 mt-0.5">
                            {line.variantTitle}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.id)}
                        aria-label={`Retirer ${line.title} du panier`}
                        disabled={isCheckingOut}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => decrement(line.id)}
                          aria-label="Diminuer la quantité"
                          disabled={isCheckingOut}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-white/60 text-stone-700 hover:border-stone-900 hover:text-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <span className="min-w-[1.5rem] text-center text-sm font-medium text-stone-900">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increment(line.id)}
                          aria-label="Augmenter la quantité"
                          disabled={isCheckingOut}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 bg-white/60 text-stone-700 hover:border-stone-900 hover:text-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                      <span className="font-serif text-sm font-bold text-stone-900">
                        {formatPrice(line.price * line.quantity, line.currencyCode)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pied : sous-total + CTA */}
            <div className="border-t border-stone-200/80 px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.15em] font-sans text-stone-500">
                  Sous-total
                </span>
                <span className="font-serif text-xl font-bold text-stone-900">
                  {formatPrice(subtotal, currencyCode)}
                </span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Livraison et taxes calculées à l'étape suivante. Chaque pièce
                est confectionnée ou préparée avec soin dans nos ateliers.
              </p>

              {/* Message d'erreur / mode démo */}
              {checkoutError && (
                <div
                  className="rounded-xl border border-amber-700/30 bg-amber-50/50 p-3 text-sm text-amber-700 flex items-start gap-2"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1">
                    <p>{checkoutError}</p>
                    {isDemoMode && (
                      <p className="text-xs leading-relaxed">
                        <strong>Contexte portfolio :</strong> La boutique Shopify est en
                        mode démo / protégée par mot de passe, ou les variantes
                        sélectionnées ne possèdent pas d&apos;ID Storefront valide.
                        Le panier local fonctionne, mais la redirection vers le
                        paiement Shopify n&apos;est pas disponible dans cet environnement.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isCheckingOut || lines.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4" aria-hidden="true" />
                    <span>Création du panier…</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                    <span>Passer commande</span>
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={closeDrawer}
                disabled={isCheckingOut}
                className="w-full text-center text-xs uppercase tracking-[0.15em] font-sans text-stone-500 hover:text-stone-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer mes achats
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}