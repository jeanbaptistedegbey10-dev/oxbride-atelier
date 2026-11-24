/** @file
 * OXBride Atelier — API Compte : Création de compte.
 * Route : POST /api/account/register
 *
 * Tente la création via Shopify Storefront API (`customerCreate`).
 * En cas d'échec (mode démo, scope manquant, boutique protégée), retourne
 * un succès en mode `local` pour que l'UI poursuive en mode portfolio.
 *
 * Input : { firstName, lastName, email, password, phone? }
 * Output : { success, mode, accessToken?, customer?, errors? }
 */

import { createCustomer } from '@/lib/shopify/queries';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return Response.json(
        { success: false, errors: ['Payload invalide.'], mode: 'local' },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password, phone } = body as {
      firstName?: unknown;
      lastName?: unknown;
      email?: unknown;
      password?: unknown;
      phone?: unknown;
    };

    if (
      typeof firstName !== 'string' ||
      firstName.trim().length < 2 ||
      typeof lastName !== 'string' ||
      lastName.trim().length < 2
    ) {
      return Response.json(
        { success: false, errors: ['Prénom et nom requis (2 caractères minimum).'], mode: 'local' },
        { status: 422 }
      );
    }

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
    const shopifyResult = await createCustomer({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: typeof phone === 'string' ? phone.trim() : undefined,
    });

    if (shopifyResult && shopifyResult.accessToken) {
      return Response.json(
        {
          success: true,
          mode: 'shopify',
          accessToken: shopifyResult.accessToken,
          customer: {
            id: shopifyResult.customerId,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            phone: typeof phone === 'string' ? phone.trim() : null,
          },
        },
        { status: 200 }
      );
    }

    // Repli local (portfolio).
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[API /account/register] Shopify indisponible, repli local :',
        shopifyResult?.errors ?? 'réponse vide'
      );
    }

    return Response.json(
      {
        success: true,
        mode: 'local',
        message: 'Compte créé en mode local (portfolio).',
      },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API /account/register] Erreur :', error);
    }
    return Response.json(
      {
        success: true,
        mode: 'local',
        message: 'Compte créé en mode local (portfolio, hors ligne).',
      },
      { status: 200 }
    );
  }
}