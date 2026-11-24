/** @file
 * OXBride Atelier — Page « Liste de souhaits » (Neo-Luxe Lumineux).
 * Route : /wishlist
 *
 * Page dédiée branchée sur WishlistProvider (oxb-wishlist-v1).
 * Affiche les pièces favorites en grille, avec lien vers la fiche produit,
 * retrait de la liste et action rapide vers le panier.
 *
 * Palette : fond champagne `#F9F8F6`, cartes `bg-white/90`, accents `#9A7B5B` / `#C8B094`.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useWishlist } from '@/components/wishlist/WishlistProvider';
import { useCart } from '@/components/cart/CartProvider';

export default function WishlistPage() {
  const { items, remove, count, isDrawerOpen, closeDrawer } = useWishlist();
  const { addItem } = useCart();

  const [hydrated, setHydrated] = useState(false);
  const [removingHandle, setRemovingHandle] = useState<string | null>(null);
  const [addingToCartHandle, setAddingToCartHandle] = useState<string | null>(null);

  // Hydratation après montage pour éviter le flash SSR
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Fermer le tiroir s'il est ouvert (la page remplace le tiroir)
  useEffect(() => {
    if (isDrawerOpen) closeDrawer();
  }, [isDrawerOpen, closeDrawer]);

  const handleAddToCart = async (item: typeof items[0]) => {
    if (addingToCartHandle) return;

    setAddingToCartHandle(item.handle);
    try {
      addItem({
        id: item.handle, // On utilise le handle comme ID pour l'ajout panier
        handle: item.handle,
        title: item.title,
        variantTitle: 'Sélection par défaut',
        price: 0, // Prix non connu côté wishlist (formaté en string)
        currencyCode: 'EUR',
        imageUrl: item.imageUrl,
        quantity: 1,
      });
    } finally {
      setTimeout(() => setAddingToCartHandle(null), 500);
    }
  };

  const handleRemove = (handle: string) => {
    setRemovingHandle(handle);
    setTimeout(() => {
      remove(handle);
      setRemovingHandle(null);
    }, 200);
  };

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-stone-500">
          <Sparkles className="w-8 h-8 animate-pulse text-[#9A7B5B]" aria-hidden="true" />
          <p className="text-sm font-sans uppercase tracking-wider">Chargement…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9F8F6]">
      {/* ================================================================
          Hero — Liste de souhaits
          ================================================================ */}
      <section className="border-b border-stone-200/80 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 text-center">
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-[#9A7B5B] font-sans mb-6">
            Votre Sélection
          </span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold leading-[1] tracking-tight text-stone-900 mb-6">
            Liste de souhaits
          </h1>
          <p className="text-lg md:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
            {count > 0
              ? `${count} pièce${count > 1 ? 's' : ''} enregistrée${count > 1 ? 's' : ''} — prête${count > 1 ? 's' : ''} à rejoindre votre panier ou à faire l'objet d'un rendez-vous.`
              : 'Aucune pièce enregistrée pour l\'instant. Parcourez nos collections et touchez le cœur des créations qui vous inspirent.'}
          </p>
        </div>
      </section>

      {/* ================================================================
          Grille des souhaits
          ================================================================ */}
      <section className="py-12 md:py-16 lg:py-20 bg-[#F9F8F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-16 md:py-24">
              <Heart className="mx-auto w-16 h-16 text-stone-300 mb-6" aria-hidden="true" />
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-stone-900 mb-4">
                Aucune pièce enregistrée
              </h2>
              <p className="text-stone-600 max-w-md mx-auto mb-8 leading-relaxed">
                Votre sélection est vide. Chaque pièce est une œuvre unique —
                laissez-vous guider par votre intuition.
              </p>
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors"
              >
                Explorer les collections
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  Vos coups de cœur ({count})
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {items.map((item) => (
                  <article
                    key={item.handle}
                    className={[
                      'relative rounded-3xl overflow-hidden border transition-all duration-300',
                      'bg-white/90 border-stone-200/80',
                      'hover:border-[#C8B094] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]',
                      removingHandle === item.handle && 'opacity-50 scale-95',
                    ].join(' ')}
                  >
                    <Link
                      href={item.link}
                      className="block relative h-72 overflow-hidden"
                      aria-label={`Voir ${item.title}`}
                    >
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.imageAlt || item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-stone-100">
                          <Heart className="w-10 h-10 text-stone-300" aria-hidden="true" />
                        </div>
                      )}
                    </Link>

                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={item.link}
                          className="font-serif text-lg font-medium text-stone-900 leading-snug line-clamp-2 hover:text-[#9A7B5B] transition-colors"
                        >
                          {item.title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.handle)}
                          aria-label={`Retirer ${item.title} de la liste de souhaits`}
                          disabled={removingHandle !== null}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>

                      <p className="text-xs uppercase tracking-widest text-stone-500 font-sans">
                        {item.price}
                      </p>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          disabled={addingToCartHandle !== null}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-none border border-stone-300 bg-transparent py-2.5 px-4 text-xs font-sans uppercase tracking-[0.1em] text-stone-900 hover:border-stone-900 hover:bg-[#F2ECE4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Ajouter au panier</span>
                        </button>
                        <Link
                          href={item.link}
                          className="flex-1 inline-flex items-center justify-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-2.5 px-4 text-xs font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors"
                        >
                          Voir la pièce
                          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* CTA bas de page */}
              <div className="mt-12 text-center">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 text-sm font-sans uppercase tracking-[0.15em] text-stone-600 hover:text-[#9A7B5B] transition-colors"
                >
                  Continuer la découverte
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ================================================================
          CTA Rendez-vous
          ================================================================ */}
      <section className="py-16 md:py-20 lg:py-24 border-t border-stone-200/80 bg-[#F2ECE4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            Prolongez l'expérience en salon privé
          </h3>
          <p className="text-stone-600 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Essayage, conseil en image, prise de mesures : réservez un
            rendez-vous dans nos salons de Paris ou d'Abomey-Calavi pour
            concrétiser vos coups de cœur.
          </p>
          <Link
            href="/rendez-vous"
            className="inline-flex items-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-4 px-8 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors"
          >
            Réserver un essayage
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}