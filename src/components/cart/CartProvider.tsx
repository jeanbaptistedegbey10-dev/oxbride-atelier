/**
 * OXBride Atelier — Store panier (Client Context).
 *
 * - Gère l'ajout, l'incrément/décrément, la suppression et le sous-total.
 * - Persistance `localStorage` sécurisée (uniquement côté client, tolérant
 *   aux erreurs de parsing/stockage).
 * - Expose l'ouverture/fermeture du tiroir (slide-over) via un booléen.
 * - Expose `createCheckout` pour créer un panier Shopify Storefront API
 *   et récupérer le `checkoutUrl` (redirection vers le paiement Shopify).
 *
 * Le provider doit être monté une seule fois, en amont du Header et du Footer
 * (dans `src/app/layout.tsx`), afin que le badge du Header et le tiroir
 * partagent le même état.
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
import type { CartLine } from '@/types/commerce';

const STORAGE_KEY = 'oxb-cart-v1';

interface CartContextValue {
  lines: CartLine[];
  /** Nombre total d'articles (somme des quantités). */
  count: number;
  /** Sous-total en centimes. */
  subtotal: number;
  /** Code devise dominant (première ligne), sinon EUR. */
  currencyCode: string;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addItem: (line: Omit<CartLine, 'quantity'> & { quantity?: number }) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  isInCart: (variantId: string) => boolean;
  /** Crée un panier Storefront API et redirige vers le checkoutUrl. */
  createCheckout: () => Promise<{ success: boolean; checkoutUrl?: string; error?: string; demoMode?: boolean }>;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Lecture tolérante du localStorage (parse + validation de forme). */
function readStoredCart(): CartLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line): line is CartLine =>
        !!line &&
        typeof line === 'object' &&
        typeof (line as CartLine).id === 'string' &&
        typeof (line as CartLine).title === 'string' &&
        typeof (line as CartLine).price === 'number' &&
        typeof (line as CartLine).quantity === 'number' &&
        (line as CartLine).quantity > 0
    );
  } catch {
    return [];
  }
}

/** Écriture tolérante du localStorage (n'échoue jamais silencieusement). */
function writeStoredCart(lines: CartLine[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Stockage indisponible (mode privé, quota) : on ignore silencieusement.
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydratation initiale depuis le localStorage (après montage client).
  useEffect(() => {
    setLines(readStoredCart());
    setHydrated(true);
  }, []);

  // Persistance à chaque changement (uniquement après hydratation).
  useEffect(() => {
    if (!hydrated) return;
    writeStoredCart(lines);
  }, [lines, hydrated]);

  const addItem = useCallback(
    (line: Omit<CartLine, 'quantity'> & { quantity?: number }) => {
      const quantity = Math.max(1, line.quantity ?? 1);
      setLines((prev) => {
        const existing = prev.find((item) => item.id === line.id);
        if (existing) {
          return prev.map((item) =>
            item.id === line.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { ...line, quantity }];
      });
      setIsDrawerOpen(true);
    },
    []
  );

  const increment = useCallback((id: string) => {
    setLines((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decrement = useCallback((id: string) => {
    setLines((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((v) => !v), []);

  const isInCart = useCallback(
    (variantId: string) => lines.some((line) => line.id === variantId),
    [lines]
  );

  const createCheckout = useCallback(async () => {
    if (lines.length === 0) {
      return { success: false, error: 'Panier vide.' };
    }

    const checkoutLines = lines.map((line) => ({
      merchandiseId: line.id,
      quantity: line.quantity,
    }));

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines: checkoutLines }),
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        return { success: true, checkoutUrl: data.checkoutUrl };
      }

      // Mode démo ou erreur Shopify (mais pas d'erreur réseau)
      return {
        success: false,
        error: data.errors?.[0] || 'Impossible de créer le panier Shopify.',
        demoMode: data.demoMode ?? false,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur réseau lors de la création du panier.',
      };
    }
  }, [lines]);

  const count = useMemo(
    () => lines.reduce((total, line) => total + line.quantity, 0),
    [lines]
  );

  const subtotal = useMemo(
    () => lines.reduce((total, line) => total + line.price * line.quantity, 0),
    [lines]
  );

  const currencyCode = lines[0]?.currencyCode ?? 'EUR';

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count,
      subtotal,
      currencyCode,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      addItem,
      increment,
      decrement,
      remove,
      clear,
      isInCart,
      createCheckout,
    }),
    [
      lines,
      count,
      subtotal,
      currencyCode,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      addItem,
      increment,
      decrement,
      remove,
      clear,
      isInCart,
      createCheckout,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Hook d'accès au store panier. Lève une erreur si utilisé hors provider. */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart doit être utilisé à l\'intérieur d\'un <CartProvider>.');
  }
  return context;
}