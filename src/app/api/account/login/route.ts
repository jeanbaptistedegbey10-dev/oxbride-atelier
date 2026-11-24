/** @file
 * OXBride Atelier — API Compte : Connexion.
 * Route : POST /api/account/login
 *
 * Tente la connexion via Shopify Storefront API (`customerAccessTokenCreate`).
 * En cas d'échec (scope, mode démo, identifiants), retourne un résultat en
 * mode `local` pour permettre la connexion locale de démonstration.
 *
 * Input : { email, password }
 * Output : { success, mode, accessToken?, customer?, errors? }
 */

import { createCustomerAccessToken, getCustomer } from '@/lib/shopify/queries';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return Response.json(
        { success: false, errors: ['Payload invalide.'], mode: 'local' },
        { status: 400 }
      );
    }

    const { email, password } = body as { email?: unknown; password?: unknown };

    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { success: false, errors: ['Courriel invalide.'], mode: 'local' },
        { status: 422 }
      );
    }

    if (typeof password !== 'string' || password.length < 6) {
      return Response.json(
        { success: false, errors: ['Mot de passe requis (6 caractères minimum).'], mode: 'local' },
        { status: 422 }
      );
    }

    // Tentative Shopify.
    const tokenResult = await createCustomerAccessToken(email.trim().toLowerCase(), password);

    if (tokenResult && tokenResult.accessToken) {
      const customer = await getCustomer(tokenResult.accessToken);
      return Response.json(
        {
          success: true,
          mode: 'shopify',
          accessToken: tokenResult.accessToken,
          expiresAt: tokenResult.expiresAt,
          customer: customer
            ? {
                id: customer.id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                email: customer.email,
                phone: customer.phone,
                defaultAddress: customer.defaultAddress,
              }
            : null,
        },
        { status: 200 }
      );
    }

    // Échec Shopify : laisser le provider tenter la connexion locale.
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[API /account/login] Shopify indisponible, repli local :',
        tokenResult?.errors ?? 'réponse vide'
      );
    }

    return Response.json(
      {
        success: false,
        mode: 'local',
        errors: tokenResult?.errors ?? ['Identifiants incorrects.'],
        message: 'Connexion Shopify indisponible (mode portfolio).',
      },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API /account/login] Erreur :', error);
    }
    return Response.json(
      {
        success: false,
        mode: 'local',
        errors: ['Connexion Shopify indisponible (hors ligne).'],
      },
      { status: 200 }
    );
  }
}