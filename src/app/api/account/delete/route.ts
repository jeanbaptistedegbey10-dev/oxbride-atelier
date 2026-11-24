/** @file
 * OXBride Atelier — API Compte : Suppression du compte.
 * Route : POST /api/account/delete
 *
 * Tente la suppression via Shopify (`customerDelete`, si supportée par la config).
 * Si Shopify bloque l'opération (scope/permission), retourne `success: false`
 * avec un message clair : le provider bascule alors sur la suppression locale.
 *
 * Input : { accessToken }
 * Output : { success, mode, errors? }
 */

import { deleteCustomer } from '@/lib/shopify/queries';

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return Response.json(
        { success: false, errors: ['Payload invalide.'], mode: 'local' },
        { status: 400 }
      );
    }

    const { accessToken } = body as { accessToken?: unknown };

    if (typeof accessToken !== 'string' || accessToken.length === 0) {
      return Response.json(
        { success: false, errors: ['Token d\'accès manquant.'], mode: 'local' },
        { status: 422 }
      );
    }

    const result = await deleteCustomer(accessToken);

    if (result && result.success) {
      return Response.json({ success: true, mode: 'shopify' }, { status: 200 });
    }

    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[API /account/delete] Suppression Shopify indisponible, repli local :',
        result?.errors ?? 'réponse vide'
      );
    }

    return Response.json(
      {
        success: false,
        mode: 'shopify',
        errors: result?.errors ?? ['Suppression non supportée par la boutique.'],
        message:
          'La suppression distante n\'est pas disponible sur cette boutique. Suppression locale uniquement.',
      },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[API /account/delete] Erreur :', error);
    }
    return Response.json(
      {
        success: false,
        mode: 'local',
        errors: ['Suppression distante indisponible (hors ligne).'],
      },
      { status: 200 }
    );
  }
}