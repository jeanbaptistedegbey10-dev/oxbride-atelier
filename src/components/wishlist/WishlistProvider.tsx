/**
 * OXBride Atelier — Store liste de souhaits (Client Context).
 *
 * - Ajout / retrait d'une pièce (par handle).
 * - Persistance `localStorage` sécurisée (côté client uniquement).
 * - Expose l'ouverture/fermeture du tiroir « sélection enregistrée ».
 *
 * Le provider est monté une seule fois dans `src/app/layout.tsx` afin que le
 * Header (icône + badge) et les cartes produit partagent le même état.
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { WishlistItem } from '@/types/commerce';

const STORAGE_KEY = 'oxb-wishlist-v1';

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  add: (item: WishlistItem) => void;
  remove: (handle: string) => void;
  toggle: (item: WishlistItem) => void;
  has: (handle: string) => boolean;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

function readStoredWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is WishlistItem =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as WishlistItem).handle === 'string' &&
        typeof (item as WishlistItem).title === 'string'
    );
  } catch {
    return [];
  }
}

function writeStoredWishlist(items: WishlistItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Stockage indisponible : ignoré silencieusement.
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredWishlist());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStoredWishlist(items);
  }, [items, hydrated]);

  const add = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((existing) => existing.handle === item.handle)) return prev;
      return [item, ...prev];
    });
  }, []);

  const remove = useCallback((handle: string) => {
    setItems((prev) => prev.filter((item) => item.handle !== handle));
  }, []);

  const toggle = useCallback((item: WishlistItem) => {
    setItems((prev) => {
      if (prev.some((existing) => existing.handle === item.handle)) {
        return prev.filter((existing) => existing.handle !== item.handle);
      }
      return [item, ...prev];
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((v) => !v), []);

  const has = useCallback(
    (handle: string) => items.some((item) => item.handle === handle),
    [items]
  );

  const count = items.length;

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      count,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      add,
      remove,
      toggle,
      has,
      clear,
    }),
    [items, count, isDrawerOpen, openDrawer, closeDrawer, toggleDrawer, add, remove, toggle, has, clear]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist doit être utilisé à l\'intérieur d\'un <WishlistProvider>.');
  }
  return context;
}