/**
 * OXBride Atelier — Typages du panier et de la liste de souhaits (client).
 *
 * Ces structures sont persistées dans `localStorage` (côté client uniquement)
 * et exposées via des Context React. Aucune donnée sensible n'y est stockée.
 */

/** Ligne du panier : un produit + une variante + une quantité. */
export interface CartLine {
  /** Identifiant unique de la ligne (variante). */
  id: string;
  /** Référence produit Shopify (handle). */
  handle: string;
  /** Titre du produit. */
  title: string;
  /** Titre de la variante (ex : « Taille 38 / Ivoire »). */
  variantTitle: string;
  /** Prix unitaire en centimes. */
  price: number;
  /** Code devise ISO (ex : EUR). */
  currencyCode: string;
  /** URL de la première image (facultatif). */
  imageUrl: string;
  /** Quantité (>= 1). */
  quantity: number;
}

/** Entrée de la liste de souhaits : un produit (sans variante figée). */
export interface WishlistItem {
  /** Identifiant stable du produit (handle). */
  handle: string;
  title: string;
  /** Prix affiché (déjà formaté côté serveur, ex : « 1 200 € »). */
  price: string;
  imageUrl: string;
  imageAlt: string;
  link: string;
}