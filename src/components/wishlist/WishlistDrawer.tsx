/**
 * OXBride Atelier — Tiroir « Liste de souhaits » (slide-over).
 *
 * - Panneau latéral droit, fond champagne poudré, bordure fine.
 * - Liste des pièces enregistrées avec image, titre, prix et lien.
 * - Retrait d'une pièce, lien vers la fiche produit, accès direct.
 * - Lien vers la page complète /wishlist.
 * - Fermeture par bouton, overlay ou touche Échap.
 *
 * Toutes les icônes SVG ont une taille explicite (`w-4 h-4` / `w-5 h-5`).
 */

'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from './WishlistProvider';

export default function WishlistDrawer() {
  const { items, isDrawerOpen, closeDrawer, remove } = useWishlist();

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Liste de souhaits">
      <button
        type="button"
        aria-label="Fermer la liste de souhaits"
        onClick={closeDrawer}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-[#F9F8F6] shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200/80">
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Vos coups de cœur{items.length > 0 ? ` (${items.length})` : ''}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Fermer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white/60 text-stone-700 hover:border-stone-900 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <Heart className="w-10 h-10 text-stone-300" aria-hidden="true" />
            <p className="font-serif text-lg text-stone-700">Aucune pièce enregistrée</p>
            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
              Touchez le cœur d'une pièce pour la retrouver ici et composer
              votre sélection.
            </p>
            <Link
              href="/wishlist"
              onClick={closeDrawer}
              className="mt-2 inline-flex items-center gap-2 rounded-none border border-stone-900 bg-stone-900 py-3 px-6 text-sm font-sans uppercase tracking-[0.1em] text-white hover:bg-stone-700 hover:border-stone-700 transition-colors"
            >
              Voir la liste complète
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4 space-y-5">
              {items.map((item) => (
                <li key={item.handle} className="flex gap-4">
                  <Link
                    href={item.link}
                    onClick={closeDrawer}
                    className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-stone-200/60 bg-stone-100"
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.imageAlt || item.title}
                        fill
                        sizes="80px"
                        className="object-cover object-center"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center">
                        <Heart className="w-5 h-5 text-stone-300" aria-hidden="true" />
                      </span>
                    )}
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={item.link}
                        onClick={closeDrawer}
                        className="font-serif text-sm font-medium text-stone-900 leading-snug line-clamp-2 hover:text-amber-700 transition-colors"
                      >
                        {item.title}
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(item.handle)}
                        aria-label={`Retirer ${item.title} de la liste de souhaits`}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                    <p className="mt-auto text-xs uppercase tracking-widest text-stone-500">
                      {item.price}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Lien vers la page complète */}
            <div className="border-t border-stone-200/80 px-6 py-4">
              <Link
                href="/wishlist"
                onClick={closeDrawer}
                className="inline-flex items-center justify-center gap-2 text-sm font-sans uppercase tracking-[0.15em] text-stone-600 hover:text-[#9A7B5B] transition-colors"
              >
                Voir la liste complète
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}