/** @file
 * OXBride Atelier — API Compte : Mise à jour du profil.
 * Route : POST /api/account/update
 *
 * Tente la mise à jour via Shopify (`customerUpdate`).
 * Retourne un succès même en cas d'échec Shopify (le provider conserve
 * la version locale) pour ne pas bloquer l'UX portfolio.
 *
 * Input : { accessToken, customer: { firstName, lastName, email, phone? } }
 * Output : { success, mode, customer?, errors? }
 */

import { updateCustomer } from '@/lib/shopify/queries';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return Response.json(
        { success: false, errors: ['Payload invalide.'], mode: 'local' },
        { status: 400 }
      );
    }

    const { accessToken, customer } = body as {
      accessToken?: unknown;
      customer?: unknown;
    };

    if (typeof accessToken !== 'string' || accessToken.length === 0) {
      return Response.json(
        { success: false, errors: ['Token d\'accès manquant.'], mode: 'local' },
        { status: 422 }
      );
    }

    if (!customer || typeof customer !== 'object') {
      return Response.json(
        { success: false, errors: ['Données client invalides.'], mode: 'local' },
        { status: 422 }
      );
    }

    const input = customer as {
      firstName?: unknown;
      lastName?: unknown;
      email?: unknown;
      phone?: unknown;
    };

    const updatePayload: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    } = {};

    if (typeof input.firstName === 'string' && input.firstName.trim()) {
      updatePayload.firstName = input.firstName.trim();
    }
    if (typeof input.lastName === 'string' && input.lastName.trim()) {
      updatePayload.lastName = input.lastName.trim();
    }
    if (typeof input.email === 'string' && input.email.trim()) {
      updatePayload.email = input.email.trim().toLowerCase();
    }
    if (typeof input.phone === 'string' && input.phone.trim()) {
      updatePayload.phone = input.phone.trim();
    }

    const result = await updateCustomer(accessToken, updatePayload);

    if (result && result.customer) {
      return Response.json(
        {
          success: true,
          mode: 'shopify',
          customer: result.customer,
        },
        { status: 200 }
      );
    }

    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[API /account/update] Shopify indisponible, mise à jour locale conservée :',
        result?.errors ?? 'réponse vide'
      );
    }

    return Response.json(
      {
        success: true,
        mode: 'local',
        message: 'Profil mis à jour localement (Shopify indisponible).',
        errors: result?.errors,
      },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API /account/update] Erreur :', error);
    }
    return Response.json(
      {
        success: true,
        mode: 'local',
        message: 'Profil mis à jour localement (hors ligne).',
      },
      { status: 200 }
    );
  }
}