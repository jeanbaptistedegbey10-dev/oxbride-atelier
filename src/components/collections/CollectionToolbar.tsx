/** @file
 * OXBride Atelier — Barre supérieure de collection (Neo-Luxe).
 * Recherche de pièce synchronisée avec l'URL (`?q=...`) + compteur de
 * résultats. Le tri et les facettes sont gérés par `CollectionFilters`.
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Search, X } from 'lucide-react';

interface CollectionToolbarProps {
  /** Recherche courante lue depuis l'URL. */
  initialQuery: string;
  /** Nombre de pièces affichées après filtrage. */
  total: number;
  /** Nombre de pièces au total (avant filtrage). */
  totalUnfiltered: number;
}

export default function CollectionToolbar({
  initialQuery,
  total,
  totalUnfiltered,
}: CollectionToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const pushQuery = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set('q', value);
      } else {
        params.delete('q');
      }
      const qs = params.toString();
      router.push(qs ? `?${qs}` : '?', { scroll: false });
    },
    [router, searchParams]
  );

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      pushQuery(query.trim());
    },
    [pushQuery, query]
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    pushQuery('');
  }, [pushQuery]);

  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <form onSubmit={onSubmit} className="w-full md:max-w-sm" role="search">
        <label
          htmlFor="collection-search"
          className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 font-sans mb-2"
        >
          Rechercher une pièce
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            id="collection-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Une coupe, une matière, un nom…"
            className="w-full rounded-none border border-stone-300/70 bg-white/60 py-3 pl-11 pr-10 text-sm font-sans text-stone-800 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Effacer la recherche"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      <p className="text-xs uppercase tracking-[0.2em] text-stone-500 font-sans shrink-0">
        {total} pièce{total > 1 ? 's' : ''}
        {total !== totalUnfiltered && (
          <span className="text-stone-400"> sur {totalUnfiltered}</span>
        )}
      </p>
    </div>
  );
}