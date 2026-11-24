/** @file
 * OXBride Atelier — API Checkout (Storefront API cartCreate).
 * Route : POST /api/checkout
 *
 * Input : { lines: Array<{ merchandiseId: string, quantity: number }> }
 * Output : { success: true, checkoutUrl: string } | { success: false, errors: string[], demoMode?: boolean }
 *
 * Si la boutique est en mode démo/mot de passe ou si une variante n'a pas
 * d'ID Storefront valide, retourne un message explicite sans faire planter l'interface.
 */

import { createCartAndGetCheckoutUrl } from '@/lib/shopify/queries';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !Array.isArray(body.lines)) {
      return Response.json(
        { success: false, errors: ['Payload invalide : "lines" (tableau) requis.'] },
        { status: 400 }
      );
    }

    const lines = body.lines;

    // Validation basique des lignes
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line || typeof line !== 'object') {
        return Response.json(
          { success: false, errors: [`Ligne ${i} : objet invalide.`] },
          { status: 422 }
        );
      }
      if (!line.merchandiseId || typeof line.merchandiseId !== 'string') {
        return Response.json(
          { success: false, errors: [`Ligne ${i} : merchandiseId (variante Shopify ID) requis.`] },
          { status: 422 }
        );
      }
      if (!Number.isInteger(line.quantity) || line.quantity < 1) {
        return Response.json(
          { success: false, errors: [`Ligne ${i} : quantity doit être un entier >= 1.`] },
          { status: 422 }
        );
      }
    }

    // Appel Storefront API
    const checkoutUrl = await createCartAndGetCheckoutUrl(lines);

    if (checkoutUrl) {
      return Response.json({ success: true, checkoutUrl }, { status: 200 });
    }

    // Pas de checkoutUrl : mode démo, boutique protégée, ou erreur API
    // On ne fait pas planter : on retourne un état clair pour l'UI.
    return Response.json(
      {
        success: false,
        errors: [
          'Impossible de créer le panier Shopify (mode démo, boutique protégée par mot de passe, ou variante introuvable).',
        ],
        demoMode: true,
      },
      { status: 200 } // 200 pour ne pas déclencher d'erreur réseau côté client
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API /checkout] Erreur inattendue :', error);
    }
    return Response.json(
      {
        success: false,
        errors: ['Erreur serveur lors de la création du panier.'],
      },
      { status: 500 }
    );
  }
}