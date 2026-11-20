/** @file
 * OXBride Atelier — Panneau latéral de filtres de collection (Neo-Luxe).
 * Filtres basés sur les **collections Shopify réelles** (excluant 'lookbook') :
 *   - Catégories principales (ex: Femme / Mariée, Homme / Costumes, Alliances & Joaillerie)
 *   - Sous-catégories (ex: Classique Royale, Édition Contemporaine, Silhouette Sirène & Dentelle)
 *   - Tri (Prix, Nouveautés, Alphabétique)
 * Synchronisés avec l'URL (`?category=...&subcategory=...&sort=...&q=...`).
 */

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Check, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import type {
  CollectionFilterGroup,
  CollectionSelection,
  SortOption,
} from './collectionUtils';

interface CollectionFiltersProps {
  groups: CollectionFilterGroup[];
  selection: CollectionSelection;
  sortOptions: SortOption[];
  hasActiveFilters: boolean;
  allCollections: Array<{ handle: string; title: string }>;
}

export default function CollectionFilters({
  groups,
  selection,
  sortOptions,
  hasActiveFilters,
  allCollections,
}: CollectionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const push = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const qs = params.toString();
      router.push(qs ? `?${qs}` : '?', { scroll: false });
    },
    [router, searchParams]
  );

  const toggleCategory = useCallback(
    (handle: string) => {
      push((params) => {
        const list = (params.get('category') ?? '')
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean);
        const next = list.includes(handle)
          ? list.filter((entry) => entry !== handle)
          : [...list, handle];
        if (next.length > 0) {
          params.set('category', next.join(','));
        } else {
          params.delete('category');
        }
        // Nettoyer les sous-catégories qui ne sont plus dans les catégories actives
        // (optionnel, pour UX)
      });
    },
    [push]
  );

  const toggleSubcategory = useCallback(
    (handle: string) => {
      push((params) => {
        const list = (params.get('subcategory') ?? '')
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean);
        const next = list.includes(handle)
          ? list.filter((entry) => entry !== handle)
          : [...list, handle];
        if (next.length > 0) {
          params.set('subcategory', next.join(','));
        } else {
          params.delete('subcategory');
        }
      });
    },
    [push]
  );

  const setSort = useCallback(
    (value: string) => {
      push((params) => {
        if (value === 'featured') {
          params.delete('sort');
        } else {
          params.set('sort', value);
        }
      });
    },
    [push]
  );

  const clearAll = useCallback(() => {
    push((params) => {
      for (const key of ['category', 'subcategory', 'sort'] as const) {
        params.delete(key);
      }
    });
  }, [push]);

  const isCategorySelected = (handle: string): boolean =>
    selection.categories.includes(handle);
  const isSubcategorySelected = (handle: string): boolean =>
    selection.subcategories.includes(handle);

  return (
    <aside
      className="lg:sticky lg:top-24 bg-[#F9F8F6]"
      aria-label="Filtres de collection"
    >
      <div className="border border-stone-200/80 rounded-2xl bg-white/40 backdrop-blur-sm">
        {/* En-tête */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200/60">
          <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-sans">
            Filtrer
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors font-sans"
            >
              <RotateCcw className="h-3 w-3" />
              Effacer
            </button>
          )}
        </div>

        {/* Groupes de collections */}
        <div className="divide-y divide-stone-200/60">
          {groups.map((group) => (
            <fieldset key={group.key} className="px-6 py-5">
              {group.children.length > 0 ? (
                // Groupe avec sous-catégories (accordéon)
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleCategory(group.key)}
                      aria-pressed={isCategorySelected(group.key)}
                      className="group w-full flex items-center gap-3 py-1.5 text-left text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
                          isCategorySelected(group.key)
                            ? 'border-stone-900 bg-stone-900 text-white'
                            : 'border-stone-300/80 bg-transparent group-hover:border-stone-500'
                        }`}
                      >
                        {isCategorySelected(group.key) && <Check className="h-3 w-3" />}
                      </span>
                      <span className="leading-snug truncate">
                        {group.label}
                      </span>
                      {group.productsCount > 0 && (
                        <span className="ml-auto text-[10px] text-stone-400 font-sans">
                          {group.productsCount}
                        </span>
                      )}
                    </button>
                    <ChevronDown
                      className={`h-4 w-4 text-stone-400 transition-transform duration-300 ${
                        isCategorySelected(group.key) ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {isCategorySelected(group.key) && group.children.length > 0 && (
                    <div className="ml-7 space-y-1 border-l border-stone-200/60 pl-3">
                      {group.children.map((child) => (
                        <label key={child.value} className="flex items-center gap-3 py-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSubcategorySelected(child.value)}
                            onChange={() => toggleSubcategory(child.value)}
                            className="h-4 w-4 accent-stone-900 border-stone-300/80 rounded focus:ring-2 focus:ring-stone-900"
                          />
                          <span className={`text-sm leading-snug ${
                            isSubcategorySelected(child.value) ? 'text-stone-900 font-medium' : 'text-stone-600'
                          }`}>
                            {child.label}
                          </span>
                          {child.productsCount > 0 && (
                            <span className="ml-auto text-[10px] text-stone-400 font-sans">
                              {child.productsCount}
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Collection simple (sans sous-catégories)
                <div className="space-y-1">
                  <label className="flex items-center gap-3 py-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCategorySelected(group.key)}
                      onChange={() => toggleCategory(group.key)}
                      className="h-4 w-4 accent-stone-900 border-stone-300/80 rounded focus:ring-2 focus:ring-stone-900"
                    />
                    <span className={`text-sm leading-snug ${
                      isCategorySelected(group.key) ? 'text-stone-900 font-medium' : 'text-stone-600'
                    }`}>
                      {group.label}
                    </span>
                    {group.productsCount > 0 && (
                      <span className="ml-auto text-[10px] text-stone-400 font-sans">
                        {group.productsCount}
                      </span>
                    )}
                  </label>
                </div>
              )}
            </fieldset>
          ))}

          {groups.length === 0 && (
            <div className="px-6 py-8 text-center text-stone-500 text-sm">
              Aucune collection disponible
            </div>
          )}
        </div>

        {/* Tri */}
        <div className="px-6 py-5 border-t border-stone-200/60">
          <span className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 font-sans mb-3">
            Trier par
          </span>
          <ul className="space-y-1">
            {sortOptions.map((option) => {
              const active = selection.sort === option.value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => setSort(option.value)}
                    aria-pressed={active}
                    className="group flex w-full items-center gap-3 py-1.5 text-left text-sm text-stone-600 hover:text-stone-900 transition-colors"
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        active
                          ? 'border-stone-900'
                          : 'border-stone-300/80 group-hover:border-stone-500'
                      }`}
                    >
                      {active && (
                        <span className="h-2 w-2 rounded-full bg-stone-900" />
                      )}
                    </span>
                    <span
                      className={`leading-snug ${
                        active ? 'text-stone-900 font-medium' : ''
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}