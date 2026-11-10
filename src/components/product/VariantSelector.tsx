/** @file
 * OXBride Atelier — Sélecteur de variantes (taille, couleur…).
 * Puces raffinées sans arrondi. Le groupe est réactif : chaque sélection
 * met à jour la variante Shopify correspondante.
 */

'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { ProductVariantData } from '@/types/shopify';

interface VariantSelectorProps {
  variants: ProductVariantData[];
  onChange: (variant: ProductVariantData | null) => void;
}

export default function VariantSelector({
  variants,
  onChange,
}: VariantSelectorProps) {
  // Regroupe les options par nom (ex: "Taille", "Couleur") avec leurs valeurs.
  const optionGroups = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const variant of variants) {
      for (const option of variant.selectedOptions) {
        if (!map.has(option.name)) map.set(option.name, new Set());
        map.get(option.name)!.add(option.value);
      }
    }
    return Array.from(map.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));
  }, [variants]);

  const initialSelections = useMemo(() => {
    const selections: Record<string, string> = {};
    for (const { name, values } of optionGroups) {
      selections[name] = values[0];
    }
    return selections;
  }, [optionGroups]);

  const [selections, setSelections] = useState<Record<string, string>>(
    initialSelections
  );

  // Variante correspondant à la combinaison sélectionnée.
  const matchingVariant = useMemo(() => {
    return variants.find((variant) =>
      variant.selectedOptions.every(
        (option) =>
          selections[option.name] === undefined ||
          selections[option.name] === option.value
      )
    );
  }, [variants, selections]);

  useEffect(() => {
    onChange(matchingVariant ?? null);
  }, [matchingVariant, onChange]);

  const handleSelect = useCallback(
    (name: string, value: string) => {
      setSelections((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  if (optionGroups.length === 0) return null;

  return (
    <div className="space-y-4">
      <span className="block text-[10px] uppercase tracking-widest text-stone-500 font-sans font-medium">
        Déclinaisons
      </span>
      <div className="grid grid-cols-1 gap-4">
        {optionGroups.map((group) => (
          <div key={group.name} className="space-y-2">
            <label
              className="block text-[10px] md:text-xs uppercase tracking-widest text-stone-600 font-sans font-medium leading-none"
            >
              {group.name}
            </label>
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => {
                const isSelected = selections[group.name] === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleSelect(group.name, value)}
                    aria-pressed={isSelected}
                    className={`whitespace-nowrap border rounded-none px-5 py-2.5 text-xs font-sans transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-300/60 bg-stone-50/60 text-stone-700 hover:border-stone-500/80 hover:bg-stone-200/60'
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}